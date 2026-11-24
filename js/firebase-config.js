// ============================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBDbKMvQM4wJjh5uLKHKmAhIhOlVSeLYY8",
  authDomain: "projetointegrador-73bc8.firebaseapp.com",
  databaseURL: "https://projetointegrador-73bc8-default-rtdb.firebaseio.com",
  projectId: "projetointegrador-73bc8",
  storageBucket: "projetointegrador-73bc8.firebasestorage.app",
  messagingSenderId: "1092867457303",
  appId: "1:1092867457303:web:d790fdcb6a78df917b7752"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referência global ao banco de dados
const database = firebase.database();