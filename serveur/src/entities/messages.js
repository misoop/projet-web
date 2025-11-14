const { ObjectId } = require('mongodb')

class Messages {

    constructor (client) {
        this.client = client
        this.db = this.client.db("mongodb");
        this.collection = this.db.collection("messages")
    }

    async initMessages() { // Méthode pour initialiser des messages dans la base de données
        try{

            const nb_messages = await this.collection.countDocuments();

            if (nb_messages==0) {

                /*Création de deux messages sur le forum ouvert */
                await this.createMessage("cam",true,"Salut comment ça va ?",false)
                await this.createMessage("michelle",true,"Ceci est un premier message",false);
            }


        }catch(err){
            console.error("Erreur lors de l'initialisation de messages : ",err);
        }
    }

    async createMessage (pseudo, publicMsg, contenu, comment) {
        try {

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Les mois dans JavaScript sont indexés à partir de zéro, donc nous ajoutons 1
            const day = date.getDate();
            let formattedDate = '';

            if (day < 10) {
                formattedDate += `0${day}-`;

            } else {
                formattedDate += `${day}-`;
            }

            if (month < 10) {
                formattedDate += `0${month}`;

            } else {
                formattedDate += `${month}`;
            }

            formattedDate += `-${year}`

            const heures = date.getHours();
            const minutes = date.getMinutes();
            const formattedTime = `${heures}:${minutes}`
            let message = {
                comment: comment,
                pseudo: pseudo,
                public: publicMsg,
                date: formattedDate,
                temps: formattedTime,
                contenu: contenu,
                reponses: [],
                likes: []
            }

            await this.collection.insertOne(message)
            
            
            return message
            
        } catch (e) {
            console.log("Erreur : " + e);

        }
    }

    async deleteMessage (msgid) {
        try {
            await this.collection.deleteOne({_id: new ObjectId(msgid)})
            
            return;
        } catch (e) {
            console.log("Erreur : ", e)
        }
    }

    async deleteRep (msgid, repid) {
        try {
            const message = await this.getMessageFromId(msgid)

            if (message) {
                await this.collection.updateOne(
                    { _id: new ObjectId(msgid)}, 
                    { $pull: { reponses: new ObjectId(repid) }} 
                )
                .then(async res => {
                    await this.deleteMessage(repid)
                })
            }

            return;

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }

    async addReponse (pseudo, publicMsg, contenu, msgid) {
        try {
            const message = await this.getMessageFromId(msgid)
            console.log(message)

            if (message) { // le message existe
                const reponse = await this.createMessage(pseudo, publicMsg, contenu, true)

                await this.collection.updateOne(
                    { _id: new ObjectId(msgid) }, // Filtre pour trouver le document par son ID
                    { $push: { reponses: reponse._id } } // Utilisation de $push pour ajouter un élément à 'tab'
                )
                
                const msg = await this.getMessageFromId(msgid)

                return msg.reponses

            } else {
                console.log("Le message correspondant au msgid n'exite pas")

                return null
            }

        } catch (e) {
            console.log("Erreur : " + e);

        }
    }

    async getListMessages () {
        try {
            const options = { projection: { } }
            const listMessages = await this.collection.find({comment: false}, options).toArray();

            return listMessages

        } catch (e) {
            console.log("Erreur : " + e)
        }
    }
//
    async getListReponses (msgid) {
        try {
            const options = { projection: { } }
            const message = await this.collection.findOne({_id: new ObjectId(msgid)}, options);

            return message.reponses

        } catch (e) {
            console.log("Erreur : " + e)
        }
    }

    async deleteListReponse (msgid) {
        try {
            const reponses = await this.getListReponses (msgid)
            reponses.map (async (element, index) => {
                await this.deleteRep(msgid, element)

            })

        } catch (e) {

            console.log("Erreur : ", e)
        }
    }

    async getMessageFromId (msgid) {
        try {
            const message = await this.collection.findOne({_id: new ObjectId(msgid)})

            return message

        } catch (e) {
            console.log("Erreur : " + e)
        }   
    }

    async getMessageFromPseudo (pseudo) {
        try {
            const messages = await this.collection.find({pseudo: pseudo}).toArray()

            return messages

        } catch (e) {
            console.log("Erreur : " + e)
        }   
    }

    async addLike (msgid, pseudo) {
        try {

            const message = await this.getMessageFromId(msgid)
            let likes = message.likes.length

            if (message) { // le message existe
                if (message.likes.includes(pseudo)) { // la personne a déjà liké
                    // on retire le like
                    likes = likes - 1

                    await this.collection.updateOne(
                        { _id: new ObjectId(msgid) }, // Filtre pour trouver le document par son ID
                        { $pull: { likes: pseudo } } // Utilisation de $pull pour enlever un élément à 'tab'
                    )
                } else { // la personne n'a pas liké
                    // on ajoute un like
                    likes = likes + 1

                    await this.collection.updateOne(
                        { _id: new ObjectId(msgid) }, // Filtre pour trouver le document par son ID
                        { $push: { likes: pseudo } } // Utilisation de $push pour ajouter un élément à 'tab'
                    )
                }

            } else {
                console.log("Le message correspondant au msgid n'exite pas")

                return null
            }

            return likes

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }
  
}
  
exports.default = Messages;
  
  
  