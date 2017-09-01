define(['angular-ui-router'],function(){
    var app = angular.module("backgroundApp", ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('main');
            $stateProvider
                .state("main",{
                    url:"/main",
                    templateUrl: 'template/main.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/main'], function(){
                                F_Main_Entrance._init();
                            });
                        })
                    }
                })
                .state("member",{
                    url:"/member",
                    templateUrl: 'template/member.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/member'], function(){
                                F_Member_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideSummary",{
                    url:"/insideSummary",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/overview'], function(){
                                F_Overview_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideOverview",{
                    url:"/insideOverview",
                    templateUrl: 'template/summary.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/summary'], function(){
                                F_Summary_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideKeypoint",{
                    url:"/insideKeypoint",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/keypoint'], function(){
                                F_Keypoint_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideRetentioncount",{
                    url:"/insideRetentioncount",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                      $scope.$on('$viewContentLoaded', function(event, viewConfig){
                          require(['app/inside','app/retentioncount'], function(){
                              F_Retentioncount_Entrance._init();
                          });
                      })
                    }
                })
                .state("insideAdditional",{
                    url:"/insideAdditional",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/additional'], function(){
                                F_Additional_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideActivity",{
                    url:"/insideActivity",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/activity'], function(){
                                F_Activity_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideSave",{
                    url:"/insideSave",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/save'], function(){
                                F_Save_Entrance._init();
                            });
                        })
                    }
                })
                .state("insidePay",{
                    url:"/insidePay",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/pay'], function(){
                                F_Pay_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideLost",{
                    url:"/insideLost",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/lost'], function(){
                                F_Lost_Entrance._init();
                            });
                        })
                    }
                })
                .state("insidePayData",{
                  url:"/insidePayData",
                  templateUrl: 'template/keypoint.html',
                  controller: function($scope, $stateParams) {
                      $scope.$on('$viewContentLoaded', function(event, viewConfig){
                          require(['app/inside','app/paydata'], function(){
                              F_PayData_Entrance._init();
                          });
                      })
                  }
                })
                .state("insidePayOsmosis",{
                    url:"/insidePayOsmosis",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/payosmosis'], function(){
                                F_PayOsmosis_Entrance._init();
                            });
                        })
                    }
                })
                .state("insidePayConversion",{
                    url:"/insidePayConversion",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/payconversion'], function(){
                                F_PayConversion_Entrance._init();
                            });
                        })
                    }
                })
                .state("insidePayHabit",{
                    url:"/insidePayHabit",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/payhabit'], function(){
                                F_PayHabit_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideLostAnalysis",{
                  url:"/insideLostAnalysis",
                  templateUrl: 'template/keypoint.html',
                  controller: function($scope, $stateParams) {
                      $scope.$on('$viewContentLoaded', function(event, viewConfig){
                          require(['app/inside','app/lostanalysis'], function(){
                              F_LostAnalysis_Entrance._init();
                          });
                      })
                  }
                })
                .state("insideLostFunnel",{
                  url:"/insideLostFunnel",
                  templateUrl: 'template/keypoint.html',
                  controller: function($scope, $stateParams) {
                      $scope.$on('$viewContentLoaded', function(event, viewConfig){
                          require(['app/inside','app/lostfunnel'], function(){
                              F_LostFunnel_Entrance._init();
                          });
                      })
                  }
                })
                .state("insideChannelQuality",{
                  url:"/insideChannelQuality",
                  templateUrl: 'template/keypoint.html',
                  controller: function($scope, $stateParams) {
                      $scope.$on('$viewContentLoaded', function(event, viewConfig){
                          require(['app/inside','app/channelquality'], function(){
                              F_ChannelQuality_Entrance._init();
                          });
                      })
                  }
                })
                .state("insideChannelEarn",{
                    url:"/insideChannelEarn",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/channelearn'], function(){
                                F_ChannelEarn_Entrance._init();
                            });
                        })
                    }
                })
                .state("insideHabit",{
                    url:"/insideHabit",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/habit'], function(){
                                F_Habit_Entrance._init();
                            });
                        })
                    }
                })
                .state("insidePersonality",{
                    url:"/insidePersonality/:typeId",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/personality'], function(){
                                F_Personality_Entrance._init($stateParams.typeId);
                            });
                        })
                    }
                })
                .state("insideDemo",{
                    url:"/insideDemo/:typeId",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/inside','app/demo'], function(){
                                F_Demo_Entrance._init($stateParams.typeId);
                            });
                        })
                    }
                })
                .state("outsideCenter",{
                    url:"/outsideCenter/:keyword",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/center'], function(){
                                F_Center_Entrance._init($stateParams.keyword);
                            });
                        })
                    }
                })
                .state("outsideRankSentiment",{
                    url:"/outsideRankSentiment/:condition",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/inside','app/ranksentiment'], function(){
                                F_RankSentiment_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("outsideRankApp",{
                    url:"/outsideRankApp",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/inside','app/rankapp'], function(){
                                F_RankApp_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideAtlas",{
                    url:"/outsideAtlas/:gameId",
                    templateUrl: 'template/atlas.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','particles','jquery.panzoom','app/atlas'], function(){
                                F_Atlas_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("outsideHotWord",{
                    url:"/outsideHotWord",
                    templateUrl: 'template/hotword.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/hotword'], function(){
                                F_Hot_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideAlarm",{
                    url:"/outsideAlarm",
                    templateUrl: 'template/alarm.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/alarm'], function(){
                                F_Alarm_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideAssistant",{
                    url:"/outsideAssistant",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/assistant'], function(){
                                F_Assistant_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideTask",{
                    url:"/outsideTask",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/task'], function(){
                                F_Task_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideChat",{
                    url:"/outsideChat",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['webuploader.min','app/outside','app/chat'], function(){
                                WebUploader = require('webuploader.min');
                                F_Chat_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideChatResult",{
                    url:"/outsideChatResult/:gameId",
                    templateUrl: 'template/chatresult.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['wcloud','app/outside','app/chatresult'], function(){
                                F_ChatResult_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("outsideFaceSummary",{
                    url:"/outsideFaceSummary",
                    templateUrl: 'template/facesummary.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facesummary'], function(){
                                F_FaceSummary_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideFaceDetail",{
                    url:"/outsideFaceDetail",
                    templateUrl: 'template/facedetail.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facedetail'], function(){
                                F_FaceDetail_Entrance._init();
                            });
                        })
                    }
                })
                .state("outsideFaceCompare",{
                    url:"/outsideFaceCompare",
                    templateUrl: 'template/facecompare.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facecompare'], function(){
                                F_FaceCompare_Entrance._init();
                            });
                        })
                    }
                })
                .state("reportsGeneral",{
                    url:"/reportsGeneral",
                    templateUrl: 'template/reports.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reports'], function(){
                                F_Reports_Entrance._init();
                            });
                        })
                    }
                })
                .state("reportsItemLost",{
                    url:"/reportsItemLost",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('4-1_1');
                            });
                        })
                    }
                })
                .state("reportsItemPay",{
                    url:"/reportsItemPay",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('4-2_2');
                            });
                        })
                    }
                })
                .state("reportsItemRationality",{
                    url:"/reportsItemRationality",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('5-1_3');
                            });
                        })
                    }
                })
                .state("reportsItemHot",{
                    url:"/reportsItemHot",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('6-1_4');
                            });
                        })
                    }
                })
                .state("reportsItemDeep",{
                    url:"/reportsItemDeep",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('6-2_5');
                            });
                        })
                    }
                })
                .state("reportsItemRival",{
                    url:"/reportsItemRival",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('6-3_6');
                            });
                        })
                    }
                })
                .state("reportsItemGuide",{
                    url:"/reportsItemGuide",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('6-4_7');
                            });
                        })
                    }
                })
                .state("reportsItemClustering",{
                    url:"/reportsItemClustering",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('4-1_8');
                            });
                        })
                    }
                })
                .state("reportsItemIp",{
                    url:"/reportsItemIp",
                    templateUrl: 'template/reportsitem.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/reportsitem'], function(){
                                F_ReportsItem_Entrance._init('6-5_9');
                            });
                        })
                    }
                })
                .state("gameLight",{
                    url:"/gameLight/:gameId",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gamelight'], function(){
                                F_GameLight_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("gameSummary",{
                    url:"/gameSummary/:gameId",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gamesummary'], function(){
                                F_GameSummary_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("gameSentiment",{
                    url:"/gameSentiment/:gameId",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/gamesentiment'], function(){
                                F_GameSentiment_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("gameForum",{
                    url:"/gameForum/:gameId",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gameforum'], function(){
                                F_GameForum_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("gameChannel",{
                    url:"/gameChannel/:gameId",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gamechannel'], function(){
                                F_GameChannel_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("gamePost",{
                    url:"/gamePost/:condition",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/gamepost'], function(){
                                F_GamePost_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameComment",{
                    url:"/gameComment/:condition",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/gamecomment'], function(){
                                F_GameComment_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameFaceSummary",{
                    url:"/gameFaceSummary/:condition",
                    templateUrl: 'template/facesummary.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facesummary'], function(){
                                F_FaceSummary_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameFaceDetail",{
                    url:"/gameFaceDetail/:condition",
                    templateUrl: 'template/facedetail.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facedetail'], function(){
                                F_FaceDetail_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameFaceCompare",{
                    url:"/gameFaceCompare/:condition",
                    templateUrl: 'template/facecompare.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/face','app/facecompare'], function(){
                                F_FaceCompare_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameTieba",{
                    url:"/gameTieba/:condition",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/outside','app/inside','app/gametieba'], function(){
                                F_GameTieba_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameAnalysis",{
                    url:"/gameAnalysis/:condition",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gameanalysis'], function(){
                                F_GameAnalysis_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("gameAssistant",{
                    url:"/gameAssistant/:condition",
                    templateUrl: 'template/game.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['app/front','app/outside','app/inside','app/gameassistant'], function(){
                                F_GameAssistant_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("operateHelper",{
                    url:"/operateHelper",
                    templateUrl: 'template/operate.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','app/inside','app/helper'], function(){
                                F_Helper_Entrance._init();
                            });
                        })
                    }
                })
                .state("operatePlayer",{
                    url:"/operatePlayer/:condition",
                    templateUrl: 'template/operate.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','app/inside','app/player'], function(){
                                F_Player_Entrance._init($stateParams.condition);
                            });
                        })
                    }
                })
                .state("operateLog",{
                    url:"/operateLog",
                    templateUrl: 'template/log.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','app/inside','app/log'], function(){
                                F_Log_Entrance._init();
                            });
                        })
                    }
                })
                .state("operateBasic",{
                    url:"/operateBasic/:gameId",
                    templateUrl: 'template/keypoint.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','app/inside','app/basic'], function(){
                                F_Basic_Entrance._init($stateParams.gameId);
                            });
                        })
                    }
                })
                .state("operatePay",{
                    url:"/operatePay",
                    templateUrl: 'template/circle.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','circle-progress.min','app/inside','app/operatepaylost'], function(){
                                F_OperatePayLost_Entrance._init('paid');
                            });
                        })
                    }
                })
                .state("operateLost",{
                    url:"/operateLost",
                    templateUrl: 'template/circle.html',
                    controller: function($scope, $stateParams) {
                        $scope.$on('$viewContentLoaded', function(event, viewConfig){
                            require(['laydate','circle-progress.min','app/inside','app/operatepaylost'], function(){
                                F_OperatePayLost_Entrance._init('lost');
                            });
                        })
                    }
                })
        })

    app.config(function($controllerProvider,$compileProvider,$filterProvider,$provide){
        app.register = {
            //得到$controllerProvider的引用
            controller : $controllerProvider.register,
            //同样的，这里也可以保存directive／filter／service的引用
            directive: $compileProvider.directive,
            filter: $compileProvider.register,
            service: $provide.service
        };
    })

    return app;
})