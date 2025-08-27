import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

// An interface that describes the properties that a User document has 
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

User.build({
  email: 'o@k.com',
  password: 'pass',
});

export { User };