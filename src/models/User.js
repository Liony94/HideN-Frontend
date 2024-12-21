// Modèle pour gérer les données utilisateur
class UserModel {
  static async getUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      return await response.json();
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  }

  static async updateUser(id, userData) {
    // Logique pour mettre à jour l'utilisateur
  }
}

export default UserModel;
