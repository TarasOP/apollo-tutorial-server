const { paginateResults } = require("../utils");
const { Mutation } = require("./mutations");

module.exports = {
  /*
   * Query
   */
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchApi.getAllLaunches();

      allLaunches.reverse();

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchApi.getLaunchById({ launchId: id }),
    me: (_, __, { dataSources }) => dataSources.userApi.findOrCreateUser(),
  },
  Mutation,

  /**
   * Mission resolver
   */
  Mission: {
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },

  /**
   * Launch resolver
   */
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userApi.isBookedOnLaunch({ launchId: launch.id }),
  },

  /**
   * User resolver
   */
  User: {
    trips: (_, __, { dataSources }) => {
      const launchIds = dataSources.userApi.getLaunchIdsByUser();
      if (!launchIds.length) return [];
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};
