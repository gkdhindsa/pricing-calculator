liveVideoPricing = 0.004
liveAudioPricing = 0.001
cloudRecordingPricing  = 0.010
rmtpPricing = 0.015
customPlanLimit = 5000
monthlyFreeMin = 10000
totalCostLimit = 20000

function restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57))
        return true;
    else
        return false;
}

function setSliderBg(slider){
    console.log(slider)
    const min = slider.min || slider[0].min
    const max = slider.max || slider[0].max
    const value = slider.value || slider[0].value
    console.log(max, min, value)
    $(slider).siblings('.slider-track').css('background', `linear-gradient(to right, #2160FD ${(value-min)/(max-min)*100}%, #DEE2E6 ${(value-min)/(max-min)*100}%)`)

}
function getConfMode()
{
    let currentConfMode = ''
    $('.conf-mode').each((key, item)=>{
        if ($(item).hasClass('active'))
        {
            currentConfMode =  $(item)[0].id
        }
    })
    return currentConfMode

}

function getSessionDuration()
{
    hours = parseInt($('#hours')[0].value)
    minutes = parseInt($('#minutes')[0].value)
    return hours*60+minutes
}

function checkIfMaximum(totalCost){
    if(totalCost>customPlanLimit)
    {
        $('.container-2-view-1').addClass('hidden')
        $('.container-2-view-2').removeClass('hidden')
    }
    else
    {
        $('.container-2-view-1').removeClass('hidden')
        $('.container-2-view-2').addClass('hidden')  
    }
}


function timeChanged(valueChanged)
{
$('.calculator-time').siblings('.tooltip').addClass('invisible')
  let hours = parseInt($('#hours')[0].value)
  let minutes = parseInt($('#minutes')[0].value)

  if(valueChanged=='hours')
  {
    if(hours<10)
    {
        //format single digit to have a preceding zero
        $('#hours').val(`0${hours}`)
    }
    else
    {
        $('#hours').val(`${hours.toString().slice(0,1)}`)
        //second digit becomes the minutes val
        $('#minutes').val(`0${hours.toString().slice(1,2)}`)
        
    }
    $('#minutes').focus()

  }

  else{
    if(minutes<10)
    {
        //format single digit to have a preceding zero
        $('#minutes').val(`0${minutes}`) 
    }
    else if(minutes>99)
    {
        $('#minutes').val(`${minutes.toString().slice(1,2)}${minutes.toString().slice(2,3)}`) 
        
        
    }
    else
    {
        $('#minutes').val(parseInt($('#minutes')[0].value)) 

    }

    //if more than 59
    if(parseInt($('#minutes')[0].value)>59)
    {
        $('#minutes').val('59')
    }
  }


  //check hours + mins >1 and <300
  totalMinutes = getSessionDuration()

  if(!totalMinutes|| totalMinutes<1)
    {
        //show tooltip min -> choose value more than 1
        $('.calculator-time').siblings('.tooltip').children('.tooltiptext').text('A call length should be at least 1 minute')
        $('.calculator-time').siblings('.tooltip').removeClass('invisible')
        $('#callLengthSlider').val(30) 
        setSliderBg($('#callLengthSlider')) 

    }
    else if(totalMinutes>300)
    {
        //show tooltip max -> choose value less than 300
        $('.calculator-time').siblings('.tooltip').children('.tooltiptext').text('Choose a value less than 5 hours')
        $('.calculator-time').siblings('.tooltip').removeClass('invisible')
        $('#callLengthSlider').val(30) 
        setSliderBg($('#callLengthSlider')) 
    }
    else{
       $('#callLengthSlider').val(totalMinutes) 
       setSliderBg($('#callLengthSlider')) 
       
       //calculate
    calculate()
    }


}


function calculate()
{
    const confMode = getConfMode()
    let numberOfParticipants = $('#participantsInput')[0].value
    //change
    let avgSessionDuration = getSessionDuration()
    let numberOfMonthlySessions = $('#monthlyCallsInput')[0].value 
    let recordingEnabled  = $('#recordingToggle')[0].checked
    let rtmpOutEnabled = $('#rtmpToggle')[0].checked

    let confCost = 0
    let finalCost =0
    let recordingCost = 0
    let rtmpOutCost  = 0
    let confMinutes = numberOfParticipants*avgSessionDuration*numberOfMonthlySessions
    let additionalMinutes = avgSessionDuration * numberOfMonthlySessions
    
    // Set conferencing calculation helper

    $('#confMinutes').text(parseInt(confMinutes).toLocaleString('en-IN'))
    console.log(confMinutes)

    confMode=='voiceConf' ? 
        $('#confCostPerMinute').text(liveAudioPricing):
        $('#confCostPerMinute').text(liveVideoPricing)
    
    if(confMinutes <= 10000)
        confCost = 0
    else
        confCost = (confMode === 'voiceConf') ? 
        (liveAudioPricing*(confMinutes - monthlyFreeMin)) :
        (liveVideoPricing*(confMinutes- monthlyFreeMin)) 


    if(recordingEnabled)
    {
        recordingCost = cloudRecordingPricing * additionalMinutes 
        console.log(recordingCost)
        
        $('#recordingMinutes').text(parseInt(additionalMinutes).toLocaleString('en-IN')) 
        $('#recordingCost').text(parseInt(recordingCost).toLocaleString('en-IN'))  
        $('#recordingSection').removeClass('invisible')

    }
    else{
        $('#recordingSection').addClass('invisible')   
    }
    if(rtmpOutEnabled){
        rtmpOutCost = rmtpPricing * additionalMinutes 
        $('#rtmpMinutes').text(parseInt(additionalMinutes).toLocaleString('en-IN'))
        $('#rtmpCost').text(parseInt(rtmpOutCost).toLocaleString('en-IN'))
        $('#rtmpSection').removeClass('invisible')
    }
    else{
        $('#rtmpSection').addClass('invisible')
    }

    console.log(confCost, recordingCost, rtmpOutCost)
    
    //setTheFinalCost
    if(confCost==0)
    {
        $('#confCost').text("FREE")
    }
    else{
        $('#confCost').text(`$${parseInt(confCost).toLocaleString('en-IN')}`)
    }
    finalCost = confCost + recordingCost + rtmpOutCost

    if(finalCost == 0 )
    {
        $('#totalCost').text('FREE')
    }
    else{
        $('#totalCost').text(`$${parseInt(finalCost).toLocaleString('en-IN')}`)
    }
    checkIfMaximum(finalCost)
    
}



//setting conference mode
$(document).ready(function(){

    //slider colour working
    $('.calculator-range').each((key, slider) => {
        setSliderBg(slider)

        $(slider).on('input', ()=>{
            setSliderBg(slider) 
        })
    })
    

    //calculate in the beginning
    calculate()
    
    //
    $('.conf-mode').click((event)=>{
        let id = event.target.id
        if(id==='voiceConf')
        {
            //already active
            if(!$('#voiceConf').hasClass('active'))
            {
                $('#videoConf').removeClass('active')
                $('#voiceConf').addClass('active')
                //calculate again
                calculate()
            }
            
        }
        else
        {
            if(!$('#videoConf').hasClass('active'))
            {
                $('#videoConf').addClass('active')
                $('#voiceConf').removeClass('active')
                //calculate again
                calculate()
            }
            
        }
    })

    
//setting participants per call -> slider and input box
$('#participantsInput').on('input' ,(event)=>{
    //remove existing tooltip
    $('#participantsInput').siblings('.tooltip').addClass('invisible')
    
    if(!event.target.value || event.target.value<2)
    {
        //show tooltip min -> choose value more than 2
        console.log('val less')

        $('#participantsInput').siblings('.tooltip').children('.tooltiptext').text('A call requires at least 2 participants.')
        $('#participantsInput').siblings('.tooltip').removeClass('invisible')
        $('#participantsSlider').val(10) 
        
        setSliderBg($('#participantsSlider')) 

    }
    else if(event.target.value>500)
    {
        //show tooltip max -> choose value less than 500
        
        $('#participantsInput').siblings('.tooltip').children('.tooltiptext').text('Choose a value less than 500')
        $('#participantsInput').siblings('.tooltip').removeClass('invisible')
        $('#participantsSlider').val(10) 
        
        setSliderBg($('#participantsSlider')) 
    }
    else{
       $('#participantsSlider').val(event.target.value) 
       setSliderBg($('#participantsSlider')) 
       //calculate
       calculate()

    }
    
    
    

})

$('#participantsSlider').on('input', (event)=>{
    $('#participantsInput').siblings('.tooltip').addClass('invisible')
    $('#participantsInput').val(event.target.value)
    //calculate
    calculate()
})

$('#hours').on('input', ()=>{timeChanged('hours')})
$('#minutes').on('input', ()=>{timeChanged('minutes')})
// setting average call length -> slider and input box


$('#callLengthSlider').on('input', (event)=>{
    $('.calculator-time').siblings('.tooltip').addClass('invisible')

    let mins = parseInt(event.target.value)
    if(mins>=60)
    {
        let hours = parseInt(mins / 60)
        let minutes = mins % 60
        $('#hours').val(`0${hours}`)
        $('#minutes').val(`${minutes<10?'0':''}${minutes}`)
    
    }
    else{
        $('#hours').val(`00`)
        $('#minutes').val(`${mins<10?'0':''}${mins}`)

    }
    //calculate
    calculate()
    
})


//setting monthly calls -> slider and input box
$('#monthlyCallsInput').on('input' ,(event)=>{
    $('#monthlyCallsInput').siblings('.tooltip').addClass('invisible')

    if(!event.target.value || event.target.value<1)
    {
        //show tooltip min -> choose value more than 0
        $('#monthlyCallsInput').siblings('.tooltip').children('.tooltiptext').text('Minimum call should  be 1')
        $('#monthlyCallsInput').siblings('.tooltip').removeClass('invisible')
        $('#monthlyCallsSlider').val(100) 
        setSliderBg($('#monthlyCallsSlider')) 

    }
    else if(event.target.value>1000)
    {
        //show tooltip max -> choose value less than 1000
        $('#monthlyCallsInput').siblings('.tooltip').children('.tooltiptext').text('Choose a value less than 1000')
        $('#monthlyCallsInput').siblings('.tooltip').removeClass('invisible')
        $('#monthlyCallsSlider').val(100) 
        setSliderBg($('#monthlyCallsSlider')) 
    }
    else{
       $('#monthlyCallsSlider').val(event.target.value) 
       setSliderBg($('#monthlyCallsSlider')) 
       //calculate
        calculate()
    }
    

})

$('#monthlyCallsSlider').on('input', (event)=>{
    $('#monthlyCallsInput').siblings('.tooltip').addClass('invisible')
    $('#monthlyCallsInput').val(event.target.value)
    //calculate
    calculate()
})


//setting recording as yes or no
$('#recordingToggle').on('input', (event)=>{
    console.log(event.target.checked)
    //calculate
    calculate()
})

//setting RTPM as yes or no
$('#rtmpToggle').on('input', (event)=>{
    console.log(event.target.checked)
    //calculate
    calculate()
})

//making icon tooltips work

    
})

