/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-30
 * Time: ����9:14
 */
define(function(){
    'use strict';

    return ['$scope', '$routeParams', '$location', 'auth', 'action', 'group', '$modal', '$q', '$filter', function($scope, $routeParams, $location, auth, Action, Group,$modal, $q, $filter){
        var page = $routeParams.page - 1;
        $scope.uid = $routeParams.uid;
        $scope.resetFlag = false;
        $scope.hasManyData = true;
        $scope.isLoading = true;
        $scope.data = [];

        Action.link('userEdit', 'user').success(function(response){
            $scope.switchFlag = response.status;
        });

        //��ȡ���������
        $scope.downloadData = function(){
            $scope.isLoading = true;

            Group.groupList({page: ++page, group: $location.hash()}).$promise.then(function(response){

                angular.forEach(response.items, function(item){
                    item.name = decodeURI(item.name);
                    item.parentName = decodeURI(item.parentName);
                    item.bindGroup = decodeURI(item.bindGroup);
                    item.info = decodeURI(item.info);
                    $scope.data.push(item);
                });

                if(!response.hasMore){
                    $scope.hasManyData = false;
                }

                $scope.isLoading = false;
            });
        };

        //���ý�������������ɸѡ��������������
        $scope.resetFilter = function(){
            $scope.status = '';
            $scope.searchText = '';
            $scope.predicate = '';
            $scope.reverse = false;

            $scope.resetFlag = 0;
        };


        //������Ч��
        $scope.changeValidity = function(index, status){

            var promise = Group.changStatus({page: page, group: $location.hash()}).$promise;
            promise.then(function(response){
                if(response['status'] == 0){

                    //�޸Ĵ�����ʾ
                    angular.element.gritter.add({
                        title: '��ʾ'
                        , text: '�û�����Ч�Ը���ʧ��!'
                        , class_name: 'loser'
                        , image: 'img/configuration2.png'
                        , sticky: false
                        , before_close: function(e, manual_close){
                            $scope.$apply(Action.forward('userGroup', 'user', {page:1}));
                        }
                    });
                }else{
                    $scope.data[index].validity = status;
                }
            });

            return promise; //����promse����switch����ж���ʾ״̬
        };

        //������ص�����
        $scope.searchData = function(){
            page=$routeParams.page-1;
            $scope.data=[];
            $scope.status = '';
            $scope.predicate = '';
            $scope.reverse = false;
            $scope.hasManyData=true;

            $location.hash($scope.searchText);
        };

        //ɾ��ָ���û�
        $scope.delete = function(object, index){
            object.isDelete = 1; //��ʶ�����ݱ�ɾ��

            Group.remove({gid: object.groupId}).$promise.then(function(reponse){
                if(reponse['status'] == 0){

                    object.isDelete = 0;    //ȡ�������ݵ�ɾ��״̬

                    //ɾ��������ʾ
                    angular.element.gritter.add({
                        title: '��ʾ'
                        , text: '�û�ɾ��ʧ��!'
                        , class_name: 'loser'
                        , image: 'img/configuration2.png'
                        , sticky: false
                        , before_close: function(e, manual_close){
                            $scope.$apply(Action.forward('userGroup', 'user' , {page:1}));
                        }
                    });

                }else{
                    //���б���ɾ����������
                    $scope.data.splice(index, 1);

                    //ɾ���¹���ʾ
                    angular.element.gritter.add({
                        title: '��ʾ'
                        , text: '�û�ɾ���ɹ�!'
                        , class_name: 'winner'
                        , image: 'img/save.png'
                        , sticky: false
                    });
                }
            });
        };

        var modalPromise = $modal({
            template: 'form.html'
            , persist: true
            , show: false
            , backdrop: 'static'
            , scope: $scope
        });
        var modal = $q.when(modalPromise);

        $scope.form = {uid: $scope.uid};

        //�����༭��ģ̬����
        $scope.modalWin = function(row){

            $scope.updateRow = row;   //����ָ��ǰ�༭�Ĺ������ݶ������ڸ�����ʾ�б�

            $scope.form.name = row.name;
            $scope.form.parentName = row.parentName;
            $scope.form.validity = row.validity;
            $scope.form.pid = row.id;

            modal.then(function(modalEl){
                modalEl.modal('show');
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            });
        };

        //����ָ���������Чʱ��
        $scope.updateDate = function(){
            Group.changStatus($scope.form).$promise.then(function(response){
                if(response['status'] == 1){

                    $scope.updateRow.name = $scope.form.name;
                    $scope.updateRow.parentName = $scope.form.parentName;

                    //�ɹ���ʾ
                    angular.element.gritter.add({
                        title: '��ʾ'
                        , text: '�û�����Ч�Ը��ĳɹ�!'
                        , class_name: 'winner'
                        , image: 'img/save.png'
                        , sticky: false
                    });

                }else{
                    //������ʾ
                    angular.element.gritter.add({
                        title: '��ʾ'
                        , text: '�û�����Ч�Ը���ʧ��!'
                        , class_name: 'loser'
                        , image: 'img/save.png'
                        , sticky: false
                        , before_close:function(uid){
                            return function(e, manual_close){
                                $scope.$apply(Action.forward('privilegeUserList', 'privilege' , {uid: uid, page: 1}));
                            };
                        }($routeParams.uid)
                    });
                }
            });
        };

        //��ȡ��һ������
        $scope.downloadData();
    }];
});