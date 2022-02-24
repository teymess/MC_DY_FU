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
    .step('Part_1_q3')
    .step('Part4_Posterior_LYL')

    stager
    .stage('Part_1_Survey')
    .step('Part_1_q2')
    .step('Part_1_q3')
    .step('Part_1_q4')
    .step('Part_1_q5')
    .step('Part_1_q6')
    .step('Part_1_q7')
    .step('Part_1_q8')

    stager
    .stage('Part2_Info_Pollution')
    .step('Instructions_Part_2')
    .step('Part2_Air_pollution_and_its_sources')
    .step('Part2_Pollution_and_life_expectancy')
    .step('Part2_Prior_LYL')
    .step('Part2_Air_pollution_damages_your_health')
    .step('Part2_Protection_measures')
    .step('Part2_Protection_measures_T')
    .step('Part2_Info_Choice')
    .step('Part2_Pollution_in_your_district')

    stager
    .stage('Part3')
    .step('Part_3_Instructions')
    .step('Part_3_Filler_Task')

    stager
    .stage('Part4')
    .step('Part4_Posterior_LYL')
    .step('Part4_LOC1')
    .step('Part4_LOC2')
    .step('Part4_LOC3')
    .step('Part4_PC')
    .step('Part4_Age_Caste')




    stager
    .stage('feedback')
    .stage('end')

    .gameover();


};
