const { gql } = require("apollo-server");

const typeDefs = gql`
  type Launch {
    id: ID!
    site: String
    rocket: Rocket
    mission: Mission
    isBooked: Boolean!
  }
  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    token: String
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Query {
    me: User
    launches(pageSize: Int, after: String): LaunchConnection!
    launch(id: ID!): Launch
  }
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }
  type Mutation {
    login(email: String): User
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
  }
  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
`;

module.exports = typeDefs;
