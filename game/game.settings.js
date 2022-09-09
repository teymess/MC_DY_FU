/**
 * # Game settings definition file
 * Copyright(c) 2022 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
     TIMER: {

         'memory_learn': 30100,

         'Part_3_Filler_Task': 120000,
     },

    BASE_PAY: 1,
    TASK_2_BONUS: 0.05,
    MEMORY_BONUS: 0.02,

    // Exchange rate coins to dollars.
    EXCHANGE_RATE: 1,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.
    // treatments: {
    //     control: {
    //         description: "No focus on perceived control"
    //     },
    //     treatment: {
    //         description: "Added focus on perceived control"
    //     }
    // }
};
