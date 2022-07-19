const { GraphQLString, GraphQLObjectType, GraphQLID, GraphQLEnumType, GraphQLNonNull } = require('graphql');
const { ClientType } = require('./clientSchema');
const { Client } = require('../models/Client');

const ProjectStatEnum = {
  new: { value: 'Not Started' },
  progress: { value: 'In Progress' },
  completed: { value: 'Completed' },
};

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const ProjectMutations = {
  addProject: {
    type: ProjectType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLNonNull(GraphQLString) },
      status: {
        type: new GraphQLEnumType({
          name: 'AddProjectStatusType',
          values: ProjectStatEnum,
        }),
        defaultValue: ProjectStatEnum.new.value,
      },
      clientId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve(_, args) {
      const project = new Project({
        name: args.name,
        description: args.description,
        status: args.status,
        clientId: args.clientId,
      });

      return project.save();
    },
  },
  deleteProject: {
    type: ProjectType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve(_, args) {
      const { id: projectId } = args || {};
      return Project.findByIdAndRemove(projectId);
    },
  },
  updateProject: {
    type: ProjectType,
    args: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: {
        type: new GraphQLEnumType({
          name: 'UpdateProjectStatusType',
          values: ProjectStatEnum,
        }),
      },
    },
    resolve(_, { id, name, description, status }) {
      return Project.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            description,
            status,
          },
        },
        { new: true }
      );
    },
  },
};

module.exports = {
  ProjectType,
  ProjectMutations,
};
