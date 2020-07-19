import mongoose from "mongoose";
import { PasswordHasher } from "../services/hasher";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await PasswordHasher.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }

  done();
});

userSchema.statics.build = (userAttrs: UserAttrs) => new User(userAttrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
