var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

// Count the number of creeps alive in the given role
function count(roleType) {
    var roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleType);
    return roleCount.length;
}

module.exports.loop = function () {

    // Use count() function to count alive creeps
    var harvesterCount = count('harvester');
    var builderCount = count('builder');
    var upgraderCount = count('upgrader');

    // Log creep counts to console
    console.log('=== Creep Counts @ ' + Game.time + ' ===');
    console.log('Harvesters: ' + harvesterCount);
    console.log('Builders: ' + builderCount);
    console.log('Upgraders: ' + upgraderCount);
    
    // Create new harvesters if we have < 2
    if(harvesterCount < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}