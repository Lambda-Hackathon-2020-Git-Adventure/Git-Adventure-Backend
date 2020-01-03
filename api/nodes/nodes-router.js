                                                                                                                                   
//    ____   ____    _________       _____    __ ______      ___      ___      ______     _____      ___   ____   __________ __________ 
//    6MMMMb/ `MM'    `MM`MM`MMb     dMM`MM    d'  `MM`MM\     `M'      `MM\     `M`MM'     `M`MM\     `M'  6MMMMb/ `MMMMMMMMM MMMMMMMMMM 
//   8P    YM  MM      MM MM MMM.   ,PMM MM   d'   MM MMM\     M        MMM\     M MM       M MMM\     M  8P    YM  MM      \ /   MM   \ 
//  6M      Y  MM      MM MM M`Mb   d'MM MM  d'    MM M\MM\    M        M\MM\    M MM       M M\MM\    M 6M      Y  MM            MM     
//  MM         MM      MM MM M YM. ,P MM MM d'     MM M \MM\   M        M \MM\   M MM       M M \MM\   M MM         MM    ,       MM     
//  MM         MMMMMMMMMM MM M `Mb d' MM MMd'      MM M  \MM\  M        M  \MM\  M MM       M M  \MM\  M MM         MMMMMMM       MM     
//  MM         MM      MM MM M  YM.P  MM MMYM.     MM M   \MM\ M        M   \MM\ M MM       M M   \MM\ M MM     ___ MM    `       MM     
//  MM         MM      MM MM M  `Mb'  MM MM YM.    MM M    \MM\M        M    \MM\M MM       M M    \MM\M MM     `M' MM            MM     
//  YM      6  MM      MM MM M   YP   MM MM  YM.   MM M     \MMM        M     \MMM YM       M M     \MMM YM      M  MM            MM     
//   8b    d9  MM      MM MM M   `'   MM MM   YM.  MM M      \MM        M      \MM  8b     d8 M      \MM  8b    d9  MM      /     MM     
//    YMMMM9  _MM_    _MM_MM_M_      _MM_MM_   YM._MM_M_      \M       _M_      \M   YMMMMM9 _M_      \M   YMMMM9  _MMMMMMMMM    _MM_                                                                                                                                                                                                                                                                                                                                                                                                                    

const router = require('express').Router();
const nodesDb = require('./nodes-model');
const authenticate = require('../../auth/authenticate-middleware');

//get all nodes with their parents/children for a story
router.get('/story/:story_id', async (req, res) => {
    const {story_id} = req.params;
    try{
        const nodes = await nodesDb.getAllNodesParentsChildren(story_id);
        if(nodes){
            res.status(200).json(nodes);
        }else{
            res.status(404).json({message: `No nodes found for story id ${story_id}`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error retrieving nodes.'})
    }
});

//get node with its parents/children
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const node = await nodesDb.getNodeParentsChildren(id);
        if(node){
            res.status(200).json(node);
        }else{
            res.status(404).json({message: `No node found with id ${id}`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error retrieving node.'})
    }
});

//add node

//example body
// {
// 	"node": {
// 		"name": "test",
// 		"text": "test text",
// 		"story_id": 1,
// 		"video": "https://google.com",
// 		"image": "https://google.com"
// 	}
// }
router.post('/', authenticate, async (req, res) => {
    try{
        const {node} = req.body;
        if(node){
            node['author_id'] = req.user.id;
            const createdNode = await nodesDb.addNode(node);
            res.status(201).json(createdNode);
        }else{
            res.status(400).json({message: 'No node was provided.'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error adding node.'});
    }
});

//connect node to parent :)
router.post('/:parent_id/connect/:child_id', authenticate, async (req, res) => {
    const {parent_id, child_id} = req.params;
    try{
        const result = await nodesDb.connectNode({parent_id, child_id});
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({message: `Error connecting child node with id ${child_id} to parent node with id ${parent_id}`});
    }
});

//add node to parent :)
router.post('/:parent_id/createandconnect', authenticate, async (req, res) => {
    const {parent_id} = req.params;
    const {node} = req.body;
    try{
        node['author_id'] = req.user.id;
        const result = await nodesDb.addNodeAndConnect(parent_id, node);
        res.status(201).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({message: `Error adding node to decision with id ${parent_id}`})
    }
});

//update node
//only send fields that are being updated
// example body:
// {
// 	"node": {
// 		"name": "CHiMKiNNungeT",
// 		"text": "chimkin nunget"
// 	}
// }

router.put('/:id', authenticate, async (req, res) => {
    const {id} = req.params;
    const {node} = req.body;
    try{
        if(node){
            const updatedNode = await nodesDb.updateNode(id, node);
            res.status(200).json(updatedNode);
        }else{
            res.status(400).json({message: 'No data was provided.'});
        }
    }catch(err){
        res.status(500).json({message: `Error updating node with id ${id}.`});
    }
});

//delete node
router.delete('/:id', authenticate, async (req, res) => {
    const {id} = req.params;

    const deleted = await nodesDb.deleteNode(id);
    if(deleted){
        res.status(200).json({message: `Node with id ${id} successfully deleted.`});
    }else{
        res.status(500).json({message: `Error deleting node with id ${id}`});
    }
});


module.exports = router;