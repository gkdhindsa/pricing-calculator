//move to next input when you finish entering a value in the first one


//triggerchange ->  minutes or hours changed
function restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57))
        return true;
    else
        return false;
}

function timeChanged(valueChanged)
{
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
  }


  //check hours + mins >1 and <300
  hours = parseInt($('#hours')[0].value)
  minutes = parseInt($('#minutes')[0].value)
  totalMinutes= hours*60+minutes
  console.log(totalMinutes)
  if(totalMinutes>300)
  {
    //tooltip
   // alert('minutes more than 300')
  }
  else if(totalMinutes<1)

  {
    //tooltip
   // alert('minutesless than 1')
  }
  else{
   // alert(totalMinutes)
    //calculate 
  }


}


$('#hours').on('input', ()=>{timeChanged('hours')})
$('#minutes').on('input', ()=>{timeChanged('minutes')})

//check validation




