import axios from "axios";

// Configuration de base d'Axios
export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteurs pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Si backend renvoie { data: ... }, on l'extrait
    return response.data;
  },
  (error) => {
    // Gestion centralisée des erreurs
    console.error("Erreur API:", error);
    
    // On pourrait ajouter des notifications (toast) ici ou rediriger vers /login
    const message = error.response?.data?.message || error.message || "Erreur de connexion au serveur";
    
    // On rejette avec un message formaté
    return Promise.reject(new Error(message));
  }
);
