let list = []
let id = 0
class Show {
  constructor( pname, ptype, pstatus, prating, pgenre, plink) {
    this.name = pname;
    this.type = ptype;
    this.status = pstatus;
    this.rating = prating;
    this.genre = pgenre;
    this.link = plink;
    this.id = id++
    
  }
}
 
  function genItem(item) {
    return item.type + ': "' + item.name + '" &#8739; ' + 'Current Status: '+ item.status +  ' &#8739; Rating: ' + item.rating + ' &#8739; Genre: ' + item.genre;
  }



$(document).on("pagebeforeshow","#list",function() {
  serverEntries();
});

$(document).on('pagebeforeshow','#stats',function() {
  serverVals();
});



function serverVals() {
  $.get('/getList', function(data, status) {
    list = data
    if (list.length) {
      let all = $('.stat').map(function() {
        return this
      }).get()
      all.forEach(item => {
        item.innerHTML = ''
      })

    let numTelevision = list.reduce(((accumulator, currentValue) => currentValue.type !== 'Movie' && currentValue.status !== 'Plan to Watch' ? accumulator + 1 : accumulator), 0);
    $('#numTelevision').append(numTelevision);
    let numWatched = list.reduce(((accumulator, currentValue) => currentValue.status == 'Watching' ? accumulator + 1 : accumulator), 0)
    $('#numWatched').append(numWatched)
    let numFinished = list.reduce(((accumulator, currentValue) => currentValue.status == 'Completed' ? accumulator + 1 : accumulator), 0)
    $('#numFinished').append(numFinished)
    let numMovies = list.reduce(((accumulator, currentValue) => currentValue.type == 'Movie' && currentValue.status !== 'Planning to Watch' ? accumulator + 1 : accumulator), 0)
    $('#numMovies').append(numMovies)
    let numPlanning = list.reduce(((accumulator, currentValue) => currentValue.status == 'Plan to Watch' ? accumulator + 1 : accumulator), 0)
    $('#numPlanning').append(numPlanning)
    //Genres 
    let numAction = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Action & Adventure' ? accumulator + 1 : accumulator), 0);
    $('#numAction').append(numAction);
    let numComedy = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Comedy' ? accumulator + 1 : accumulator), 0);
    $('#numComedy').append(numComedy);
    let numDrama = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Drama' ? accumulator + 1 : accumulator), 0);
    $('#numDrama').append(numDrama);
    let numHorror = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Horror' ? accumulator + 1 : accumulator), 0);
    $('#numHorror').append(numHorror);
    let numRomance = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Romance' ? accumulator + 1 : accumulator), 0);
    $('#numRomance').append(numRomance);
    let numScience = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Science Fiction' ? accumulator + 1 : accumulator), 0);
    $('#numScience').append(numScience);
    let numThriller = list.reduce(((accumulator, currentValue) => currentValue.genre == 'Thriller' ? accumulator + 1 : accumulator), 0);
    $('#numThriller').append(numThriller);
    }
  })
}


function newElement() {
  let programName = $('#programName').val();
  let type = $('#type').val();
  let status = $('#status').val();
  let rating = $('#rating').val();
  let genre = $('#genre').val();
  let link = $('#link').val();
  let show = new Show(programName, type, status, parseInt(rating), genre, link);

  $.ajax({
    url: '/add',
    type: 'POST',
    data: JSON.stringify(show),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(result) {
      console.log(result)
    }
  })
  $('#programName').val('');
  $('#link').val('');
}
// Removes Child Elements that were filled in and add stores list elements



function serverEntries() {
  let parent = $('#listId')
  parent.empty() // Removes all existing child elements

  $.get('/getList', function(data, status) {
    list = data
    console.log(data)
    list.forEach(item => {
      let text = genItem(item);
      if (item.link === '') {
        const search_query = item.name.replace(/\s/g, '+')
        item.link = 'https://www.youtube.com/results?search_query=' + search_query + ' trailer'
      }
       //Initialize Variables
      let newText = document.createElement('li')
      let deleteBtn = document.createElement('button')
      let listItem = document.createElement('li')
      //For css customization
      deleteBtn.setAttribute("id", "delete");
      let content = document.createElement('li')

      content.addEventListener('click', 
      function (event) {
        event.preventDefault()
        if (confirm('You are about to be redirected to a new window. PLease confirm.')) {
          window.open(item.link)
        }
      },
      false)
    
      content.innerHTML = text
      content.className = 'itemText'
      deleteBtn.onclick = function() {
        let listIndex = item.id
        $.ajax({
          type: 'DELETE',
          url: '/delete/' + listIndex,
          success: function(result) {
            newText.parentNode.removeChild(newText) 
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Error')
            alert('This program does not have a valid ID.')
          }
        })
      }
      deleteBtn.innerHTML = 'X'
  
      newText.appendChild(deleteBtn)
      newText.appendChild(content)
      newText.className = 'item'
  
      // Add it to the unordered list
      parent.append(newText);
    })
  })
}
