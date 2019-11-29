var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        function goHome() {
            var spawn = new RoomPosition(36, 31, 'W3N48');
            // Check current coords, are we already at spawn?
            if (creep.pos = spawn) {
                creep.memory.goHome = false;
            } else {
                // move to my current spawner
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }

        // above all else, go the fuck home
        if(creep.memory.goHome) {
            goHome();
        } else {
            // Stop upgrading if out of energy
            if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            
            // Upgrade if full of energy
            if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }

            
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if(creep.upgradeController(creep.room.controller) == ERR_NOT_OWNER) {
                    creep.memory.goHome = true;
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        

    }
};

module.exports = roleUpgrader;