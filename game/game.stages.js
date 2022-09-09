/**
 * # Game stages definition file
 * Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager

    stager
    .stage('consent')

    stager
    .stage('Intro')
    .step('Welcome')

    stager
    .stage('Part_1_Survey')
    .step('Part_1_q2')
    .step('Part_1_q3')
    .step('Part_1_q4')

    stager
    .stage('Part2')
    .step('Part4_Posterior_LYL')
    .step('Part2_Prior_LYL_home')
    .step('Part4_LOC1')
    .step('Part4_LOC2')
    .step('Part4_LOC3')
    .step('Part4_PC')
    .step('Part4_Poll_Severe')

    stager
    .stage('Part2_Protection_measures')
    .stage('feedback')
    .stage('end')

    .gameover();

};
