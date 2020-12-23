require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const { createStore } = require("./utils");
const isEmail = require("isemail");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

const resolvers = require("./resolvers/resolvers");

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };

    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;
    return { user: { ...user.dataValues } };
  },

  typeDefs,
  resolvers,
  dataSources: () => ({
    launchApi: new LaunchAPI(),
    userApi: new UserAPI({ store }),
  }),
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});
