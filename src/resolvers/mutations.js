/*
 * Mutations
 */

module.exports = {
  Mutation: {
    /*
     * Login
     */
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userApi.findOrCreateUser({ email });
      if (user) {
        user.token = Buffer.from(email).toString("base64");
        return user;
      }
    },

    /*
     * Book trips
     */
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userApi.bookTrips({ launchIds });
      const launches = await dataSources.launchApi.getLaunchesByIds({
        launchIds,
      });
      console.log(launches);
      return {
        launches,
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? "trips booked successfully"
            : `the following launches couldn't be booked: ${launchIds.filter(
                (id) => !results.includes(id)
              )}`,
      };
    },

    /*
     * Cancel trip
     */
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userApi.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: "failed to cancel trip",
        };

      const launch = await dataSources.launchApi.getLaunchById({ launchId });
      return {
        launches: [launch],
        success: true,
        message: "trip cancelled",
      };
    },
  },
};
