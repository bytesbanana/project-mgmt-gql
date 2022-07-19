const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const ClientMutations = {
  addClient: {
    type: ClientType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      phone: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve(_, args) {
      const { name, email, phone } = args || {};
      const client = new Client({
        name,
        email,
        phone,
      });
      return client.save();
    },
  },

  deleteClient: {
    type: ClientType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve(_, args) {
      const { id: clientId } = args || {};
      return Client.findByIdAndRemove(clientId);
    },
  },
};

module.exports = {
  ClientType,
  ClientMutations
};
