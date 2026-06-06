import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;

  role:
    | 'PATIENT'
    | 'DOCTOR'
    | 'HOSPITAL_ADMIN'
    | 'SYSTEM_ADMIN'
    | 'AMBULANCE_DRIVER';

  isActive: boolean;

  googleConnected: boolean;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleEmail?: string;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        'PATIENT',
        'DOCTOR',
        'HOSPITAL_ADMIN',
        'SYSTEM_ADMIN',
        'AMBULANCE_DRIVER',
      ],
      default: 'PATIENT',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    googleConnected: {
      type: Boolean,
      default: false,
    },

    googleAccessToken: {
      type: String,
    },

    googleRefreshToken: {
      type: String,
    },

    googleEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

UserSchema.methods.comparePassword = function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);