# LU3IN017 Projet

Réalisation d'un site web permettant à des membres d'une association d'échanger des messages avec des forums.

## Contributeurs

- Michelle SONG 21106878
- Camelia BOUALI 21108238

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- axios
- express
- mongodb
- cors
- body-parser
- express-session
- bcrypt

## Script

Pour démarrer l'application :

- lancer la base de données MongoDB
- lancer le serveur avec la commande : npm start dans le dossier `./serveur`
- lancer le fontend avec la commande : npm run dev dans le dossier `./client`

Une fois ces trois commandes lancées, ouvrir http://localhost:5173

Par défaut, la page de connexion s'affiche.

Vérifiez qu'il y a bien des données dans votre base de données.

Dans la collection *users*, remarquez que pour chaque instance, le champ "password" est remplacé par le mot de passe crypté. (Nous avons décidé de le faire comme fonctionnalité supplémentaire)

Par conséquent, on vous fournit le mot de passe associé à un compte admin :
Pseudo : mai_ml
Mot de passe : maiforum

