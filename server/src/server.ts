import express, { Response, Request } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { SocketEvent, SocketId } from "./types/socket";
import { USER_CONNECTION_STATUS, USER_ROLE, User } from "./types/user";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail } from "./utils/email";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public"))); // Serve static files

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
});

let userSocketMap: User[] = [];

// Track room settings
interface RoomSettings {
  roomId: string;
  everyoneCanEdit: boolean;
}

let roomSettings: RoomSettings[] = [];

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
});
const UserModel = mongoose.model("User", userSchema);

// Register route
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;    // Check if the user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    
    // If user exists but is not verified, delete the old record so they can register again
    if (existingUser && !existingUser.isVerified) {
      await UserModel.deleteOne({ _id: existingUser._id });
      console.log(`Deleted unverified user: ${email} to allow re-registration`);
    } 
    // If user exists and is verified, return error
    else if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });    // Save the new user
    await newUser.save();
    console.log(`User registered: ${email} with OTP: ${otp} (isVerified: false)`);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      console.error(`Failed to send verification email to ${email}`);
      return res.status(200).json({
        message:
          "User registered but failed to send verification email. Please use the resend OTP option.",
        needsVerification: true,
        otp: otp, // Only in development - remove in production!
      });
    }

    return res.status(201).json({
      message: "User registered successfully. Please verify your email with the OTP sent.",
      needsVerification: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Verify OTP endpoint
app.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // Validation
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    console.log(`Verification attempted for non-existent user: ${email}`);
    return res.status(404).json({ message: "User not found. Please register first." });
  }

  // Check if user is already verified
  if (user.isVerified) {
    console.log(`Already verified user attempting verification again: ${email}`);
    return res.status(400).json({ message: "Email already verified. Please login instead." });
  }

  // Check if OTP matches and is not expired
  const currentTime = new Date();
  if (user.otp !== otp) {
    console.log(`Invalid OTP attempt for user: ${email}`);
    return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
  }

  if (user.otpExpiry && user.otpExpiry < currentTime) {
    console.log(`Expired OTP used for user: ${email}`);
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }
  // Mark user as verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  
  console.log(`User successfully verified: ${email}`);
  res.status(200).json({ message: "Email verified successfully. You can now log in." });
});

// Resend OTP endpoint
app.post("/resend-otp", async (req: Request, res: Response) => {
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found. Please register first." });
  }

  // Check if already verified
  if (user.isVerified) {
    return res.status(400).json({ message: "Email already verified. Please login instead." });
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  // Update user with new OTP
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP email
  const emailSent = await sendOTPEmail(email, otp);

  if (!emailSent) {
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.status(200).json({ message: "New OTP sent to your email" });
});

// Login route
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if user is verified
  if (!user.isVerified) {
    return res.status(403).json({
      message: "Email not verified. Please verify your email before logging in.",
      needsVerification: true,
    });
  }

  // Check if the password matches
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token });
});

// Function to get all users in a room
function getUsersInRoom(roomId: string): User[] {
  return userSocketMap.filter((user) => user.roomId == roomId);
}

// Function to get room id by socket id
function getRoomId(socketId: SocketId): string | null {
  const roomId = userSocketMap.find((user) => user.socketId === socketId)?.roomId;

  if (!roomId) {
    console.error("Room ID is undefined for socket ID:", socketId);
    return null;
  }
  return roomId;
}

function getUserBySocketId(socketId: SocketId): User | null {
  // Check for null/undefined socketId
  if (!socketId) {
    console.error("Invalid socket ID provided (null/undefined)");
    return null;
  }

  const user = userSocketMap.find((user) => user.socketId === socketId);
  if (!user) {
    // Only log at debug level since this might be expected during disconnect/reconnect cycles
    console.debug("User not found for socket ID:", socketId);
    return null;
  }
  return user;
}

// Get or create room settings
function getRoomSettings(roomId: string): RoomSettings {
  let settings = roomSettings.find((s) => s.roomId === roomId);
  if (!settings) {
    settings = { roomId, everyoneCanEdit: false };
    roomSettings.push(settings);
  }
  return settings;
}

// Check if a user is the admin of a room (first user to join)
function isUserAdmin(socketId: string, roomId: string): boolean {
  const roomUsers = getUsersInRoom(roomId);
  if (roomUsers.length === 0) return false;

  // Admin is the first user who joined the room
  const adminUser = roomUsers.find((user) => user.role === USER_ROLE.ADMIN);
  return adminUser?.socketId === socketId;
}

// Check if a user can edit content
function canUserEdit(socketId: string, roomId: string): boolean {
  const user = getUserBySocketId(socketId);
  if (!user) return false;

  const settings = getRoomSettings(roomId);

  // Admin can always edit
  if (user.role === USER_ROLE.ADMIN) return true;

  // Everyone can edit if setting is enabled
  if (settings.everyoneCanEdit) return true;

  // Specific users with EDITOR role can edit
  return user.role === USER_ROLE.EDITOR;
}

io.on("connection", (socket) => {
  // Handle user actions
  socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
    // Check if username exists in the room
    const isUsernameExist = getUsersInRoom(roomId).filter((u) => u.username === username);
    if (isUsernameExist.length > 0) {
      io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS);
      return;
    }

    // Check if this is the first user in the room
    const isFirstUser = getUsersInRoom(roomId).length === 0;
    const role = isFirstUser ? USER_ROLE.ADMIN : USER_ROLE.VIEWER;

    const user = {
      username,
      roomId,
      status: USER_CONNECTION_STATUS.ONLINE,
      cursorPosition: 0,
      typing: false,
      socketId: socket.id,
      currentFile: null,
      role,
      inCall: false, // Start not in call, will be set to true when joining video meeting
    };

    userSocketMap.push(user);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user });
    const users = getUsersInRoom(roomId);

    // If this is the first user, create room settings
    if (isFirstUser) {
      roomSettings.push({ roomId, everyoneCanEdit: false });
    }

    // Identify which users are already in the call
    const usersInCall = users.filter(u => u.inCall === true);

    io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, {
      user,
      users,
      roomSettings: getRoomSettings(roomId),
      usersInCall, // Send the list of users already in the call
    });

    // Notify all users in the room about the updated participant list
    io.to(roomId).emit(SocketEvent.USER_JOINED, {
      users: getUsersInRoom(roomId),
    });
  });

  socket.on("disconnecting", () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    
    const roomId = user.roomId;
    
    // If the user was in a call, notify others that they've left
    if (user.inCall) {
      socket.broadcast.to(roomId).emit(SocketEvent.VIDEO_CALL_PEER_DISCONNECTED, {
        peerId: socket.id,
        username: user.username
      });
    }
    
    socket.broadcast.to(roomId).emit(SocketEvent.USER_DISCONNECTED, { user });
    userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);

    // If no users left in the room, clean up room settings
    if (getUsersInRoom(roomId).length === 0) {
      roomSettings = roomSettings.filter((s) => s.roomId !== roomId);
    } else if (user.role === USER_ROLE.ADMIN) {
      // If admin left, promote the next user to admin
      const nextUser = getUsersInRoom(roomId)[0];
      if (nextUser) {
        nextUser.role = USER_ROLE.ADMIN;
        io.to(roomId).emit(SocketEvent.USER_ROLE_UPDATED, {
          socketId: nextUser.socketId,
          role: USER_ROLE.ADMIN,
        });
      }
    }

    socket.leave(roomId);
  });

  // Handle file actions
  socket.on(SocketEvent.SYNC_FILE_STRUCTURE, ({ fileStructure, openFiles, activeFile, socketId }) => {
    io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, { fileStructure, openFiles, activeFile });
  });

  // Permission management
  socket.on(SocketEvent.REQUEST_EDIT_ACCESS, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;

    const roomId = user.roomId;
    const adminUser = getUsersInRoom(roomId).find((u) => u.role === USER_ROLE.ADMIN);

    if (adminUser) {
      socket.to(adminUser.socketId).emit(SocketEvent.REQUEST_EDIT_ACCESS, {
        username: user.username,
        socketId: socket.id,
      });
    }
  });

  socket.on(SocketEvent.EDIT_ACCESS_RESPONSE, ({ targetSocketId, approved }) => {
    const user = getUserBySocketId(socket.id);
    if (!user || user.role !== USER_ROLE.ADMIN) return;

    const targetUser = getUserBySocketId(targetSocketId);
    if (!targetUser) return;

    const roomId = targetUser.roomId;

    if (approved) {
      targetUser.role = USER_ROLE.EDITOR;
      io.to(targetSocketId).emit(SocketEvent.EDIT_ACCESS_RESPONSE, {
        approved: true,
        message: "Your edit access request was approved",
      });

      // Notify all users about the role change
      io.to(roomId).emit(SocketEvent.USER_ROLE_UPDATED, {
        socketId: targetSocketId,
        role: USER_ROLE.EDITOR,
      });
    } else {
      io.to(targetSocketId).emit(SocketEvent.EDIT_ACCESS_RESPONSE, {
        approved: false,
        message: "Your edit access request was denied",
      });
    }
  });

  socket.on(SocketEvent.TOGGLE_EVERYONE_CAN_EDIT, () => {
    const user = getUserBySocketId(socket.id);
    if (!user || user.role !== USER_ROLE.ADMIN) return;

    const roomId = user.roomId;
    const settings = getRoomSettings(roomId);

    // Toggle the setting
    settings.everyoneCanEdit = !settings.everyoneCanEdit;

    // Notify all users in the room about the change
    io.to(roomId).emit(SocketEvent.EVERYONE_CAN_EDIT_TOGGLED, {
      everyoneCanEdit: settings.everyoneCanEdit,
    });
  });

  socket.on(SocketEvent.UPDATE_USER_ROLE, ({ targetSocketId, newRole }) => {
    const user = getUserBySocketId(socket.id);
    if (!user || user.role !== USER_ROLE.ADMIN) return;

    const targetUser = getUserBySocketId(targetSocketId);
    if (!targetUser) return;

    // Don't allow changing admin's role
    if (targetUser.role === USER_ROLE.ADMIN) return;

    targetUser.role = newRole;
    const roomId = targetUser.roomId;

    // Notify all users about the role change
    io.to(roomId).emit(SocketEvent.USER_ROLE_UPDATED, {
      socketId: targetSocketId,
      role: newRole,
    });
  });

  // Check permission before allowing file modifications
  socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.FILE_UPDATED, { fileId, newContent });
  });

  socket.on(SocketEvent.DIRECTORY_CREATED, ({ parentDirId, newDirectory }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_CREATED, { parentDirId, newDirectory });
  });

  socket.on(SocketEvent.DIRECTORY_UPDATED, ({ dirId, children }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_UPDATED, { dirId, children });
  });

  socket.on(SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_RENAMED, { dirId, newName });
  });

  socket.on(SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_DELETED, { dirId });
  });

  socket.on(SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.FILE_CREATED, { parentDirId, newFile });
  });

  socket.on(SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.FILE_RENAMED, { fileId, newName });
  });

  socket.on(SocketEvent.FILE_DELETED, ({ fileId }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;

    // Only allow updates if user has permission
    if (!canUserEdit(socket.id, roomId)) return;

    socket.broadcast.to(roomId).emit(SocketEvent.FILE_DELETED, { fileId });
  });

  // Handle user status
  socket.on(SocketEvent.USER_OFFLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.OFFLINE };
      }
      return user;
    });
    const roomId = getRoomId(socketId);
    if (!roomId) return;
    socket.broadcast.to(roomId).emit(SocketEvent.USER_OFFLINE, { socketId });
  });

  socket.on(SocketEvent.USER_ONLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.ONLINE };
      }
      return user;
    });
    const roomId = getRoomId(socketId);
    if (!roomId) return;
    socket.broadcast.to(roomId).emit(SocketEvent.USER_ONLINE, { socketId });
  });

  // Handle chat actions
  socket.on(SocketEvent.SEND_MESSAGE, ({ message }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;
    socket.broadcast.to(roomId).emit(SocketEvent.RECEIVE_MESSAGE, { message });
  });

  // Handle cursor position
  socket.on(SocketEvent.TYPING_START, ({ cursorPosition }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, typing: true, cursorPosition };
      }
      return user;
    });
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.TYPING_START, { user });
  });

  socket.on(SocketEvent.TYPING_PAUSE, () => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, typing: false };
      }
      return user;
    });
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.TYPING_PAUSE, { user });
  });

  socket.on(SocketEvent.REQUEST_DRAWING, () => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;
    socket.broadcast.to(roomId).emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id });
  });

  socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
    socket.broadcast.to(socketId).emit(SocketEvent.SYNC_DRAWING, { drawingData });
  });

  socket.on(SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
    const roomId = getRoomId(socket.id);
    if (!roomId) return;
    socket.broadcast.to(roomId).emit(SocketEvent.DRAWING_UPDATE, { snapshot });
  });

  // Video call handlers
  socket.on(SocketEvent.VIDEO_CALL_ACCEPTED, ({ peerId }) => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    
    // Get all users in the room to establish mesh network
    const roomUsers = getUsersInRoom(roomId);
    
    // Notify the specific initiator that this user has accepted the call
    socket.to(peerId).emit(SocketEvent.VIDEO_CALL_PEER_CONNECTED, {
      peerId: socket.id,
      username: user.username
    });
    
    // Also notify all OTHER users already in the call about this new user
    // This ensures everyone connects with the new participant
    roomUsers.forEach(roomUser => {
      // Skip the user who just joined and the initiator (already notified above)
      if (roomUser.socketId !== socket.id && roomUser.socketId !== peerId) {
        socket.to(roomUser.socketId).emit(SocketEvent.VIDEO_CALL_PEER_CONNECTED, {
          peerId: socket.id,
          username: user.username
        });
      }
    });
  });
  
  socket.on(SocketEvent.VIDEO_CALL_USER_JOINED, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    
    // Mark this user as being in the call for future participants
    user.inCall = true;
    
    // Let everyone know someone new joined the call (for UI updates)
    socket.broadcast.to(roomId).emit(SocketEvent.VIDEO_CALL_USER_JOINED, {
      peerId: socket.id,
      username: user.username
    });
  });
  
  socket.on(SocketEvent.VIDEO_CALL_SIGNAL, ({ signal, peerId, username }) => {
    // Make sure the target peer exists before forwarding the signal
    const targetUser = getUserBySocketId(peerId);
    if (!targetUser) {
      console.debug(`Cannot forward signal to peer ${peerId} - user not found`);
      // Notify the sender that the target peer is no longer available
      socket.emit(SocketEvent.VIDEO_CALL_PEER_DISCONNECTED, {
        peerId,
        username: "Unknown User"
      });
      return;
    }

    try {
      // Forward WebRTC signal to the target peer
      socket.to(peerId).emit(SocketEvent.VIDEO_CALL_SIGNAL, {
        signal,
        peerId: socket.id,
        username
      });
    } catch (error) {
      console.error(`Error forwarding signal to peer ${peerId}:`, error);
    }
  });
  
  socket.on(SocketEvent.VIDEO_CALL_ENDED, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    
    // Mark user as no longer in the call
    user.inCall = false;
    
    // Notify all users in the room that this user left the call
    socket.broadcast.to(roomId).emit(SocketEvent.VIDEO_CALL_PEER_DISCONNECTED, {
      peerId: socket.id,
      username: user.username
    });
  });

  // Voice chat handlers
  socket.on(SocketEvent.VOICE_JOIN, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    
    // Mark this user as being in the voice call
    user.inCall = true;
    
    const roomId = user.roomId;
    
    // Get all users currently in the call for the UI
    const usersInCall = getUsersInRoom(roomId).filter(u => u.inCall);
    
    // Notify the joining user about all users already in the call
    io.to(socket.id).emit(SocketEvent.VOICE_JOIN, {
      usersInCall,
      joinSuccess: true
    });
    
    // Notify all other users in the room that this user has joined voice chat
    socket.broadcast.to(roomId).emit(SocketEvent.VOICE_JOIN, {
      socketId: socket.id,
      username: user.username
    });
    
    console.log(`User ${user.username} joined voice chat in room ${roomId}. Total users in call: ${usersInCall.length + 1}`);
  });
  
  socket.on(SocketEvent.VOICE_LEAVE, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    
    // Mark this user as no longer in the voice call
    user.inCall = false;
    
    // Notify all other users in the room that this user has left voice chat
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.VOICE_LEAVE, {
      socketId: socket.id,
      username: user.username
    });
  });
  
  socket.on(SocketEvent.VOICE_SIGNAL, ({ signal, targetId }) => {
    // Forward the WebRTC signal to the target peer
    socket.to(targetId).emit(SocketEvent.VOICE_SIGNAL, {
      signal,
      from: socket.id
    });
  });
  
  socket.on(SocketEvent.USER_SPEAKING, ({ isSpeaking, socketId }) => {
    const user = getUserBySocketId(socketId || socket.id);
    if (!user) return;
    
    // Forward the speaking state to all other users in the room
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.USER_SPEAKING, {
      socketId: socketId || socket.id,
      isSpeaking
    });
  });

  // New handler for mute status updates
  socket.on(SocketEvent.MUTE_STATUS, ({ isMuted, socketId, targetId }) => {
    const user = getUserBySocketId(socketId || socket.id);
    if (!user) return;
    
    const roomId = user.roomId;
    
    // If a specific target is provided, send only to that user
    if (targetId) {
      socket.to(targetId).emit(SocketEvent.MUTE_STATUS, {
        socketId: socketId || socket.id,
        isMuted
      });
    } else {
      // Otherwise broadcast to all users in the room
      socket.broadcast.to(roomId).emit(SocketEvent.MUTE_STATUS, {
        socketId: socketId || socket.id,
        isMuted
      });
    }
  });

  // Legacy video call handlers (keeping for backward compatibility)
  socket.on(SocketEvent.VIDEO_CALL_REQUEST, () => {
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    
    user.inCall = true;
    
    socket.broadcast.to(roomId).emit(SocketEvent.VIDEO_CALL_USER_JOINED, {
      peerId: socket.id,
      username: user.username
    });
  });
});

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
export { app, server };