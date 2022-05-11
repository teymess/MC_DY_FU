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
    .stage('Part2_Info_Pollution')
    .step('Instructions_Part_2')
    .step('Part2_Air_pollution_and_its_sources')
    .step('Part2_Air_pollution_damages_your_health')
    .step('Part2_Pollution_and_life_expectancy')
    // .step('Part2_Prior_LYL_Austria')
    // .step('Part2_Prior_LYL_Nicaragua')
    .step('Part2_Prior_LYL_home')
    .step('Part2_Protection_measures')
    //.step('Part2_Protection_measures_T')
    .step('Part2_Protection_measures_T2')
    .step('Part2_Info_Choice')
    .step('Part2_Info_Choice_Decision')
    .step('Part2_choice_outcome')
    .step('Part2_Pollution_in_your_district')

    stager
    .stage('Part3')
    .step('Part_3_Instructions')
    .step('Part_3_Filler_Task')
    .step('Part_3_Results')

    stager
    .stage('Part4')
    .step('Part4_Posterior_LYL')
    .step('Part4_LOC1')
    .step('Part4_LOC2')
    .step('Part4_LOC3')
    .step('Part4_PC')

    stager
    .stage('memory')
    .step('memory_intro')
    .step('memory_learn')
    .step('memory_test1')
    .step('memory_test2')
    .step('memory_test3')
    .step('memory_test4')
    .step('memory_test5')
    .step('memory_test6')
    .step('memory_test7')
    .step('memory_test8')
    .step('memory_test9')
    .step('memory_test10')
    .step('memory_test11')
    .step('memory_test12')
    .step('memory_test13')
    .step('memory_test14')
    .step('memory_test15')
    .step('memory_results')


    stager
    .stage('feedback')
    .stage('end')

    .gameover();

    if (treatmentName === 'control') {
        stager.skip('Part_1_Survey'),
        stager.skip('Part3'),
        stager.skip('Part4'),
        stager.skip('Part2_Info_Pollution')
        // , [
        //     'Part2_Protection_measures',
        //     'Part2_Protection_measures_T2'
            // 'Part2_Protection_measures_T',
            // 'Part2_Protection_measures_T2',
        //])
    }
    // if (treatmentName === 'info_once_austria') {
    //     stager.skip('Part2_Info_Pollution', [
    //         'Part2_Prior_LYL_Nicaragua',
    //         'Part2_Protection_measures_T',
    //         'Part2_Protection_measures_T2',
    //         'Part2_Info_Choice_Nicaragua'
    //     ])
    // }
    // else if (treatmentName === 'info_twice_austria') {
    //     stager.skip('Part2_Info_Pollution', [
    //         'Part2_Prior_LYL_Nicaragua',
    //         'Part2_Info_Choice_Nicaragua'
    //     ])
    // }
    // else if (treatmentName === 'info_once_nicaragua') {
    //     stager.skip('Part2_Info_Pollution', [
    //         'Part2_Prior_LYL_Austria',
    //         'Part2_Protection_measures_T',
    //         'Part2_Protection_measures_T2',
    //         'Part2_Info_Choice_Austria'
    //     ])
    // }
    // else if (treatmentName === 'info_twice_nicaragua') {
    //     stager.skip('Part2_Info_Pollution', [
    //         'Part2_Prior_LYL_Austria',
    //         'Part2_Info_Choice_Austria'
    //     ])
    // }
};
