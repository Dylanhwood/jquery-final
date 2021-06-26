var express = require('express');
var router = express.Router();

dataList = []

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
})

router.get('/getList', function(req, res) {
  res.status(200).json(dataList)
})

router.post('/add', function(req, res) {
  const newProgram = req.body
  dataList.push(newProgram)
  res.status(200)
})

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  let found = false
  for(let i = 0; i < dataList.length; i++) {
    if (dataList[i].id == id) {
      dataList.splice(i, 1)
      found = true
      break;
    }
  }
  if (!found) {
    return res.status(500).json({
      status: 'error'
    })
  } else {
    res.status(200).json('deleted item')
  }
})


module.exports = router;
