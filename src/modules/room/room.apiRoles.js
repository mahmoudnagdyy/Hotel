import {allSystemRoles} from '../../utils/systemRoles.js'


export const allRoomRoles = {
    addRoom: [allSystemRoles.admin],
    getRoom: [allSystemRoles.admin, allSystemRoles.guest],
    getAllRooms: [allSystemRoles.admin, allSystemRoles.guest],
    deleteRoom: [allSystemRoles.admin],
}