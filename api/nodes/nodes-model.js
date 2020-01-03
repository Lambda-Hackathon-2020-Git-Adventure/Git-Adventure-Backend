const db = require('../../data/db-config');

module.exports = {
    findById,
    addNode,
    updateNode,
    deleteNode,
    getNodeParentsChildren,
    getAllNodesParentsChildren,
    connectNode,
    addNodeAndConnect
};

function findById(id){
    return db('decisions')
        .where({id})
        .first();
}

async function addNode(node){
    const [id] = await db('decisions')
        .insert(node, 'id');
    
    return findById(id);
}

async function addNodeAndConnect(parent_id, node){
    const nodeData = await db.transaction(async trx => {
        try{
            const [newNodeId] = await trx('decisions').insert(node, 'id');
            await trx('decisions_children')
                .insert({parent_id, child_id: newNodeId});
            return newNodeId;
        }catch(err){
            throw err;
        }
    });

    return await getNodeParentsChildren(nodeData);
}

async function connectNode({parent_id, child_id}){
    try{
        const [id] = await db('decisions_children')
        .insert({parent_id, child_id}, 'id');

        return getNodeParentsChildren(parent_id);
    }catch(err){
        throw err;
    }
}

async function getNodeParentsChildren(node_id){
    const result = await Promise.all([
        //get decisions that have this node as a child
        db('decisions_children as dc')
        .where({child_id: node_id})
        .join('decisions as d', 'dc.parent_id', 'd.id')
        .select('d.*'),
        //get this node's information
        db('decisions')
        .where({id: node_id})
        .first(),
        //get children that this node links to
        db('decisions_children as dc')
        .where({parent_id: node_id})
        .join('decisions as d', 'dc.child_id', 'd.id')
        .select('d.*'),
    ]);

    const [nodeParents, specifiedNode, nodeChildren] = result;

    return {nodeParents, specifiedNode, nodeChildren};
}

async function getAllNodesParentsChildren(story_id){
    const nodeIds = await db('decisions')
        .where({story_id})
        .select('decisions.id');
    
    const nodes = await Promise.all(nodeIds.map(async ({id}) => {
        return await getNodeParentsChildren(id);
    }));

    return nodes;
}

async function updateNode(node_id, node){
     const updated = await db('decisions')
        .where({id: node_id})
        .update({...node});
    
        if(updated){
            return findById(node_id);
        }else{
            throw 'Error updating node';
        }
}

function deleteNode(node_id){
    return db('decisions')
        .where({id: node_id})
        .del();
}