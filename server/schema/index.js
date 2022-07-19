const Project = require('../models/Project');
const Client = require('../models/Client');
const { ProjectType, ProjectMutations } = require('./projectSchema');
const { ClientType, ClientMutations } = require('./clientSchema');

const { GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLList } = require('graphql');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: GraphQLList(ProjectType),
      resolve() {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: GraphQLList(ClientType),
      resolve() {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Client.findById(args.id);
      },
    },
  },
});

// MUtation
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...ClientMutations,
    ...ProjectMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
