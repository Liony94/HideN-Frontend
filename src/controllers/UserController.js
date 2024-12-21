import UserModel from "../models/User";

class UserController {
  async fetchUserData(id) {
    try {
      const userData = await UserModel.getUser(id);
      return userData;
    } catch (error) {
      console.error("Erreur controller:", error);
      throw error;
    }
  }
}

export default new UserController();
