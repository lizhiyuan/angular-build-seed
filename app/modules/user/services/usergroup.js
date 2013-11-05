/**
 * Created with JetBrains WebStorm.
 * User: @sww
 * Date: 13-10-22
 */
define([
    'config'
], function(config){
    'use strict';

    return ['$resource', function($resource){

        return $resource(config.domain + 'group/:uid/:gid/:page', {}, {
            groupList: {
                method: 'GET'
                , params: {gid: 0, uid: 0}
            }
            , find: {
                method: 'GET'
                , params: {uid:0}
            }
            , changStatus: {
                method: 'POST'
                , params: {uid: 'onlyStatus'}
            }
            , updateData: {
                method: 'POST'
                , params: {uid: 'update'}
            }
            , remove: {
                method: 'DELETE'
                , params: {uid: 'delete'}
            }
            , create: {
                method: 'PUT'
                , params: {uid: 'add'}
            }
            , save: {
                method: 'PUT'
                , params: {uid: 'save'}
            }
        });
    }];
});
