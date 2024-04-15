export interface CategorySystem {
  [key: string]: CategorySystem
}

export const categorySystem: CategorySystem = {
  safe: {
    mini: {},
    base: {
      dancing: {},
      happy: {},
      tired: {},
      unhealthy: {},
    },
  },
  explicit: {
    imminent: {},
    sex: {
      sexual_activity: {
        vaginal: {},
        anal: {},
        oral_activity: {
          oral: {},
          deepthroat: {},
          other_oral_sex: {},
        },
        handjob_activity: {
          handjob: {},
          footjob: {},
          other_hand_sex: {},
        },
        masturbation: {},
        gangbang: {},
        other_sexual_activity: {},
      },
      object_insertion: {
        vaginal_insertion: {
          vibrator: {},
          dildo: {},
          other_vaginal_insertion: {},
        },
        anal_insertion: {
          plug: {},
          anal_beads: {},
          anal_tail: {},
          other_anal_insertion: {},
        },
      },
      tentacle: {},
    },
    display: {
      sexy: {
        sexy_up: {},
        sexy_back: {},
      },
      nude: {
        nude_up: {},
        nude_laying: {},
        nude_spread: {},
      },
      bondage: {},
    },
  },
}
