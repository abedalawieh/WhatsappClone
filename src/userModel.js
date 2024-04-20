import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "This email address already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    picture: {
      type: String,
      default:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAnAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcDAv/EADoQAAIBAwEEBgcFCQEAAAAAAAABAgMEBREGITFBEhMiUYHRQmFxcpGxwRQyYqGyFSMzRFJT4eLwQ//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCVAAAAAAAAB629vWuq0aNvTc6knoooumH2WtraMal8lcVtPuvfCPhz8QKdbWV3dPS2tqtVPnGDaXjwN6OzeXktfsmntnHX5nRIRjCKjGKilwSWiR9Ac0r4PKUI9KpZVWvwaS+RHyi4ScZJqS4prRnWzTv8ZaX8HG6oQm+UtNJL2MDl4JrO7PV8X+9pN1rXX72nah73mQoAAAAAAAAAAAAAAMpOTSitW9yS5swT2x1irrKddNawt10tO+XL6/ACy7O4eOLtVKaTuaiTqS7vwomQuAAAAAAAPmcYzi4zScWtGnwZz3aXEfsu7TpJ/Zqu+D/pfOJ0Qjs9Y/b8XXopdtR6UPeXDy8QOaAyYAAAAAAAAAAAAXfYSmljrirznW019SivNlILzsLJPFVoc413+mIFjAAAAAAAAAAHLMlTVHI3VKK3QrzivZ0maxt5eXTyt7JcHXn+pmoAAAAAAAAAAAAs2w12qd5XtZP+LHpR9bXH8n+RWT1tq9S2uKdei9KlOSlFgdXBqYy/pZCzp3FJrSS7Udd8XzTNsAAAAAAGtkLqNnZVrifCnBv2vkjZKXtllVWqLH0JJwg9ask+MuS8AKxKTk25b23q/aYAAAAAAAAAAAAAAAJDD5WvirnrKXapy/iU3wkvP1l/xuUtclR6dtU1kvvQe6UfajmR9Uqk6VRVKU5QnHhKL0aA6wgUK02qyNBKNZ068e+a0l8Ub0NtHp2rBt+qt/qBbm9D56yO9t6JLVtlPrbY15aqjawg++U+lp4aIhb7K3uQbjc15OD9CPZj8F9QLFn9p4RjK2xk+lN6qVZcI+76/WU/e+L1feNABgAAAAAAAAAAAAABKYnBXeTalCPV0OdWS3eC5lyxmAsMfpKFLrKy/wDSpvfguQFLscHkb1KVK3lCD9Or2UTdtsXJpO7u0n/TSj9X5Fu0MgQFLZHGQXb6+r79TT5JHutmcSv5Xxc5eZMACFnsviZrTqJx92pI06+xlnJfuLivTfdLSS+Sf5lmAFDu9kshRTdCdKvHuT6Mvg/MhK9vWtqnV3FKdOfdNaHVzyuLajc0nTuKUKkH6MlqBygFuy2ySalVxk9H/Zm93g/MqtalUoVJUq0JU6kXo4zWjQHmAAAAAAADJatntmOmo3WSg+jxhQfP3vI9NlMEtIX97Dfxo02uH4n9C2JaAIpRikkklwS5GQAAAAAAAAAAAAEflsTb5Sk4V46TS7FSP3o/93EgAOYZTG3GMuXRuI8d8JxW6a7zSOo5GwoZC2dC4jrF8GuMX3o5zk7CtjbudvXXDfGaW6a70BqAAATey2J/aF311aOttRer19OXJfUhqdOVWpCnTWs5yUYrvb4HTsTYwx9hSt4aaxXba9KXNgbgAAAAAAAAAAAAAAAAAAEXtBio5SylCKSrwWtKXc+72MlABySUZQlKMk1KL0knyZgsm2eNVC7je0lpCtumlyn/AJXyZWwLBsZZfaMnK4lHsW61XvPcvqXtEFsZbdTh41Wu1Wm5eHBfIngAAAAAAAAAAAAAAAAAAAAADRzVmr/GV7fTWTjrD3lvRzLhxWjOts5nn7dWmYuqSWken0o+x7/qBfsJFQxFmo8Opj8jeAAAAAAAAAAAAAAAAAAAAAAAMMpG2VKEstGTW90Y6/FgAf/Z",
    },
    status: {
      type: String,
      default: "Hey there!Iam using Whatsapp",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [
        6,
        "Please make sure that your password is at least 6 characters long ",
      ],
      maxLength: [
        128,
        "Please make sure that your password is at most 128 characters long ",
      ],
    },
  },
  { collection: "users", timestamps: true }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (e) {}
});
const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
export default UserModel;
