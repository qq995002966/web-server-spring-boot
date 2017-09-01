package cn.thinkingdata.web.service.core.user.custom.inner;

import cn.thinkingdata.web.constant.ChartForm;
import cn.thinkingdata.web.domain.user.custom.inner.Do_game_menu_table_map;
import cn.thinkingdata.web.domain.user.custom.inner.game.*;
import cn.thinkingdata.web.domain.user.custom.inner.sys.Do_game_sys_analyse_config;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_game_form_config;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_game_menu_table_map;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.*;
import cn.thinkingdata.web.persistence.user.custom.inner.sys.Mapper_game_sys_analyse_config;
import cn.thinkingdata.web.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * Created by Xiaowu on 2016/10/31.
 */
@Service
public class GameOperationService {

    @Autowired
    private Mapper_game_common_stat_day mapperGameCommonStatDay;

    @Autowired
    private Mapper_game_retention_stat mapperGameRetentionStat;

    @Autowired
    private Mapper_new_user_oltime_distri mapperNewUserOltimeDistri;

    @Autowired
    private Mapper_new_user_area_distri mapperNewUserAreaDistri;

    @Autowired
    private Mapper_login_user_oldays_distri mapperLoginUserOldaysDistri;

    @Autowired
    private Mapper_login_user_level_distri mapperLoginUserLevelDistri;

    @Autowired
    private Mapper_login_user_area_distri mapperLoginUserAreaDistri;

    @Autowired
    private Mapper_retention_user_logintimes_distri mapperRetentionUserLogintimesDistri;

    @Autowired
    private Mapper_retention_user_oltime_distri mapperRetentionUserOltimeDistri;
    @Autowired
    private Mapper_retention_user_level_distri mapperRetentionUserLevelDistri;
    @Autowired
    private Mapper_retention_user_area_distri mapperRetentionUserAreaDistri;
    @Autowired
    private Mapper_pay_user_area_distri mapperPayUserAreaDistri;
    @Autowired
    private Mapper_pay_user_level_distri mapperPayUserLevelDistri;
    @Autowired
    private Mapper_pay_user_oldays_distri mapperPayUserOldaysDistri;
    @Autowired
    private Mapper_pay_user_oltime_distri mapperPayUserOltimeDistri;
    @Autowired
    private Mapper_pay_user_potential_lost_stat mapperPayUserPotentialLostStat;
    @Autowired
    private Mapper_lost_user_common_analysis mapperLostUserCommonAnalysis;
    @Autowired
    private Mapper_lost_user_oldays_distri mapperLostUserOldaysDistri;
    @Autowired
    private Mapper_lost_user_level_distri mapperLostUserLevelDistri;
    @Autowired
    private Mapper_lost_user_pay_distri mapperLostUserPayDistri;
    @Autowired
    private Mapper_lost_user_area_distri mapperLostUserAreaDistri;
    @Autowired
    private Mapper_user_habit_play_time_stat mapperUserHabitPlayTimeStat;
    @Autowired
    private Mapper_user_habit_freq_week_distri mapperUserHabitFreqWeekDistri;
    @Autowired
    private Mapper_user_habit_oltime_distri mapperUserHabitOltimeDistri;
    @Autowired
    private Mapper_user_habit_olslot_distri mapperUserHabitOlslotDistri;
    @Autowired
    private Mapper_user_habit_device_distri mapperUserHabitDeviceDistri;
    @Autowired
    private Mapper_channel_common_stat mapperChannelCommonStat;
    @Autowired
    private Mapper_pay_common_stat mapperPayCommonStat;
    @Autowired
    private Mapper_first_pay_user_oldays_distri mapperFirstPayUserOldaysDistri;
    @Autowired
    private Mapper_first_pay_user_total_oltime_distri mapperFirstPayUserTotalOltimeDistri;
    @Autowired
    private Mapper_first_pay_user_level_distri mapperFirstPayUserLevelDistri;
    @Autowired
    private Mapper_first_pay_user_amount_distri mapperFirstPayUserAmountDistri;
    @Autowired
    private Mapper_first_pay_user_item_distri mapperFirstPayUserItemDistri;
    @Autowired
    private Mapper_pay_user_paytimes_distri mapperPayUserPaytimesDistri;
    @Autowired
    private Mapper_pay_user_payamount_distri mapperPayUserPayamountDistri;
    @Autowired
    private Mapper_first_pay_user_time_elapse_distri mapperFirstPayUserTimeElapseDistri;
    @Autowired
    private Mapper_pay_user_pay_method_distri mapperPayUserPayMethodDistri;
    @Autowired
    private Mapper_pay_user_pay_item_distri mapperPayUserPayItemDistri;
    @Autowired
    private Mapper_lost_common_stat mapperLostCommonStat;
    @Autowired
    private Mapper_lost_funnel_stat mapperLostFunnelStat;
    @Autowired
    private Mapper_retention_custom_analysis mapperRetentionCustomAnalysis;
    @Autowired
    private Mapper_game_sys_analyse_config mapperGameSysAnalyseConfig;
    @Autowired
    private Mapper_game_form_config mapperGameFormConfig;
    @Autowired
    private Mapper_game_menu_table_map mapperGameMenuTableMap;

    public DataResult getOperationBase(Integer gameId,String startDate,String endDate) {
        String dataDate = DateUtil.getPartitionString(DateUtil.getOffsetDate(new Date(),-35));
        List<Do_game_common_stat_day> gameCommonStatDays = mapperGameCommonStatDay.getGameCommonStatDayListByGameId(gameId,dataDate);
        List<Do_game_retention_stat> gameRetentionStats = mapperGameRetentionStat.getGameRetentionStatListByGameId(gameId,dataDate);
        Map<String,Object> baseData = new HashMap<>();
        if(gameCommonStatDays.size()>1&& gameRetentionStats.size() > 1) {
            String common_date = DateUtil.getPartitionString(gameCommonStatDays.get(0).getData_date());
            String retention_date = DateUtil.getPartitionString(gameRetentionStats.get(0).getData_date());
            List<Do_game_common_stat_day> avgGameCommonStat = mapperGameCommonStatDay.getGameCommonStatDayAvgByGameId(gameId,common_date);
            List<Do_game_retention_stat> avgGameRetentionStat = mapperGameRetentionStat.getGameRetentionStatAvgByGameId(gameId,retention_date);

            Map<String,Object> avg_newlogin_num = new HashMap<>();
            avg_newlogin_num.put("value",(gameCommonStatDays.get(0).getNewlogin_num()>gameCommonStatDays.get(1).getNewlogin_num()?"+":"-")+"|"+gameCommonStatDays.get(0).getNewlogin_num());
            avg_newlogin_num.put("avg_newlogin_num_1d", avgGameCommonStat.get(0).getNewlogin_num());
            avg_newlogin_num.put("avg_newlogin_num_7d", avgGameCommonStat.get(1).getNewlogin_num());
            avg_newlogin_num.put("avg_newlogin_num_30d", avgGameCommonStat.get(2).getNewlogin_num());

            baseData.put("newlogin_num", avg_newlogin_num);

            Map<String,Object> avg_retention_rate = new HashMap<>();
            avg_retention_rate.put("value",(gameRetentionStats.get(0).getRetention_rate_1d()>gameRetentionStats.get(1).getRetention_rate_1d()?"+":"-")+"|"+gameRetentionStats.get(0).getRetention_rate_1d()  + "%");
            avg_retention_rate.put("avg_retention_rate_1d", avgGameRetentionStat.get(0).getRetention_rate_1d());
            avg_retention_rate.put("avg_retention_rate_7d", avgGameRetentionStat.get(1).getRetention_rate_1d());
            avg_retention_rate.put("avg_retention_rate_30d", avgGameRetentionStat.get(2).getRetention_rate_1d());

            baseData.put("retention_rate", avg_retention_rate);

            Map<String,Object> avg_login_num = new HashMap<>();
            avg_login_num.put("value",(gameCommonStatDays.get(0).getLogin_num()>gameCommonStatDays.get(1).getLogin_num()?"+":"-")+"|"+gameCommonStatDays.get(0).getLogin_num());
            avg_login_num.put("avg_login_num_1d", avgGameCommonStat.get(0).getLogin_num());
            avg_login_num.put("avg_login_num_7d", avgGameCommonStat.get(1).getLogin_num());
            avg_login_num.put("avg_login_num_30d", avgGameCommonStat.get(2).getLogin_num());

            baseData.put("login_num", avg_login_num);


            Map<String,Object> avgOnlineMinutes = new HashMap<>();
            avgOnlineMinutes.put("value",(gameCommonStatDays.get(0).getAvg_online_minutes()>gameCommonStatDays.get(1).getAvg_online_minutes()?"+":"-")+"|"+gameCommonStatDays.get(0).getAvg_online_minutes() + "mins");
            avgOnlineMinutes.put("avg_online_minutes_1d", avgGameCommonStat.get(0).getAvg_online_minutes() + "mins");
            avgOnlineMinutes.put("avg_online_minutes_7d", avgGameCommonStat.get(1).getAvg_online_minutes() + "mins");
            avgOnlineMinutes.put("avg_online_minutes_30d", avgGameCommonStat.get(2).getAvg_online_minutes() + "mins");
            baseData.put("avg_online_minutes", avgOnlineMinutes);

            Map<String,Object> avgLoginTimes = new HashMap<>();
            avgLoginTimes.put("value",(gameCommonStatDays.get(0).getAvg_login_times()>gameCommonStatDays.get(1).getAvg_login_times()?"+":"-")+"|"+gameCommonStatDays.get(0).getAvg_login_times());
            avgLoginTimes.put("avg_login_times_1d", avgGameCommonStat.get(0).getAvg_login_times());
            avgLoginTimes.put("avg_login_times_7d", avgGameCommonStat.get(1).getAvg_login_times());
            avgLoginTimes.put("avg_login_times_30d", avgGameCommonStat.get(2).getAvg_login_times());
            baseData.put("avg_login_times", avgLoginTimes);

            baseData.put("potential_lost_num",(gameCommonStatDays.get(0).getPotential_pay_num()>gameCommonStatDays.get(1).getPotential_lost_num()?"+":"-")+"|"+ gameCommonStatDays.get(0).getPotential_lost_num());

            Map<String,Object> payNum = new HashMap<>();
            payNum.put("value",(gameCommonStatDays.get(0).getPay_num()>gameCommonStatDays.get(1).getPay_num()?"+":"-")+"|"+gameCommonStatDays.get(0).getPay_num());
            payNum.put("pay_num_1d", avgGameCommonStat.get(0).getPay_num());
            payNum.put("pay_num_7d", avgGameCommonStat.get(1).getPay_num());
            payNum.put("pay_num_30d", avgGameCommonStat.get(2).getPay_num());
            baseData.put("pay_num",payNum);

            Map<String,Object> payRate = new HashMap<>();
            payRate.put("value",(gameCommonStatDays.get(0).getPay_rate()>gameCommonStatDays.get(1).getPay_rate()?"+":"-")+"|"+gameCommonStatDays.get(0).getPay_rate()  + "%");
            payRate.put("pay_rate_1d", avgGameCommonStat.get(0).getPay_rate()  + "%");
            payRate.put("pay_rate_7d", avgGameCommonStat.get(1).getPay_rate()  + "%");
            payRate.put("pay_rate_30d", avgGameCommonStat.get(2).getPay_rate()  + "%");
            baseData.put("pay_rate",payRate);

            Map<String,Object> arpu = new HashMap<>();
            arpu.put("value",(gameCommonStatDays.get(0).getArpu()>gameCommonStatDays.get(1).getArpu()?"+":"-")+"|"+"￥" + gameCommonStatDays.get(0).getArpu());
            arpu.put("arpu_1d", "￥" + avgGameCommonStat.get(0).getArpu());
            arpu.put("arpu_7d", "￥" + avgGameCommonStat.get(1).getArpu());
            arpu.put("arpu_30d", "￥" + avgGameCommonStat.get(2).getArpu());
            baseData.put("arpu", arpu);
            baseData.put("potential_pay_num", (gameCommonStatDays.get(0).getPotential_pay_num()>gameCommonStatDays.get(1).getPotential_pay_num()?"+":"-")+"|"+gameCommonStatDays.get(0).getPotential_pay_num());
        }
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(), gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        Map<String,Object> active_user_new = new HashMap<>();
        Map<String,Object> active_user_old = new HashMap<>();
        Map<String,Object> pay_user_first = new HashMap<>();
        Map<String,Object> pay_user_second = new HashMap<>();
        Map<String,Object> pay_user_potential = new HashMap<>();
        Map<String,Object> lost_user = new HashMap<>();
        Map<String,Object> lost_user_potential = new HashMap<>();
        Float avg_login_num = 0.0f;
        Float avg_pay_num = 0.0f;
        Float avg_lost_num = 0.0f;
        Float avg_potential_lost_num = 0.0f;

        Integer i = 1;
        for (Do_game_common_stat_day gameCommonStatDay : gameCommonStatDayList) {
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            avg_login_num += (gameCommonStatDay.getLogin_num()-avg_login_num)/i;
            avg_pay_num += (gameCommonStatDay.getPay_num()-avg_pay_num)/i;
            avg_lost_num += (gameCommonStatDay.getLost_num()-avg_lost_num)/i;
            avg_potential_lost_num += (gameCommonStatDay.getPotential_lost_num()-avg_potential_lost_num)/i;
            i++;

            active_user_new.put(statDate,gameCommonStatDay.getNewlogin_num());
            active_user_old.put(statDate,gameCommonStatDay.getOldlogin_num());
            pay_user_first.put(statDate,gameCommonStatDay.getFirst_pay_num());
            pay_user_second.put(statDate,gameCommonStatDay.getPay_again_num());
            pay_user_potential.put(statDate,gameCommonStatDay.getPotential_pay_num());
            lost_user.put(statDate,gameCommonStatDay.getLost_num());
            lost_user_potential.put(statDate,gameCommonStatDay.getPotential_lost_num());
        }

        Map<String, Object> axis = new HashMap<>();
        axis.put("x_axis", x_axis);
        axis.put("avg_login_num", CommonUtil.FloatSet2Scale(avg_login_num));
        axis.put("avg_pay_num", CommonUtil.FloatSet2Scale(avg_pay_num));
        axis.put("avg_lost_num", CommonUtil.FloatSet2Scale(avg_lost_num));
        axis.put("avg_potential_lost_num", avg_potential_lost_num);
        axis.put("active_user_new", CommonUtil.getXAxisDataWithYAxisMap(x_axis,active_user_new));
        axis.put("active_user_old", CommonUtil.getXAxisDataWithYAxisMap(x_axis,active_user_old));
        axis.put("pay_user_first", CommonUtil.getXAxisDataWithYAxisMap(x_axis,pay_user_first));
        axis.put("pay_user_second", CommonUtil.getXAxisDataWithYAxisMap(x_axis,pay_user_second));
        axis.put("pay_user_potential", CommonUtil.getXAxisDataWithYAxisMap(x_axis,pay_user_potential));
        axis.put("lost_user", CommonUtil.getXAxisDataWithYAxisMap(x_axis,lost_user));
        axis.put("lost_user_potential", CommonUtil.getXAxisDataWithYAxisMap(x_axis,lost_user_potential));
        Map<String, Object> resultMap = new HashMap<>();

        resultMap.put("base",baseData);
        resultMap.put("data",axis);
        return new DataResult(ReturnCodeDim.SUCCESS,resultMap);
    }

    public DataResult getOperationKPI(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_game_retention_stat> gameRetentionStats = mapperGameRetentionStat.getGameRetentionStatListByGameIdAndDate(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        Collections.sort(gameRetentionStats, new Comparator<Do_game_retention_stat>(){
            @Override
            public int compare(Do_game_retention_stat o1, Do_game_retention_stat o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0){
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(),gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        List<String> x_axis_retention = new ArrayList<>();
        if(gameRetentionStats.size() > 0) {
            x_axis_retention = CommonUtil.getDatesBetweenTwoDate(gameRetentionStats.get(0).getData_date(), gameRetentionStats.get(gameRetentionStats.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_pay_rate = new HashMap<>();
        Map<String,Object> y_axis_arpu = new HashMap<>();
        Map<String,Object> y_axis_arppu = new HashMap<>();
        Map<String,Object> y_axis_avg_login_times = new HashMap<>();
        Map<String,Object> y_axis_avg_online_minutes = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_30d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_30d = new HashMap<>();
        Float avg_pay_rate = 0.0f;
        Float avg_arpu = 0.0f;
        Float avg_arppu = 0.0f;
        Float avg_login_times = 0.0f;
        Float sum_online_minutes = 0.0f;
        Integer i = 1;
        for(Do_game_common_stat_day gameCommonStatDay : gameCommonStatDayList){
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            avg_pay_rate += (gameCommonStatDay.getPay_rate()-avg_pay_rate)/i;
            avg_arpu += (gameCommonStatDay.getArpu()-avg_arpu)/i;
            avg_arppu += (gameCommonStatDay.getArppu()-avg_arppu)/i;
            avg_login_times += (gameCommonStatDay.getAvg_login_times()-avg_login_times)/i;
            sum_online_minutes += gameCommonStatDay.getAvg_online_minutes();
            i++;
            y_axis_pay_rate.put(statDate,gameCommonStatDay.getPay_rate());
            y_axis_arpu.put(statDate,gameCommonStatDay.getArpu());
            y_axis_arppu.put(statDate,gameCommonStatDay.getArppu());
            y_axis_avg_login_times.put(statDate,gameCommonStatDay.getAvg_login_times());
            y_axis_avg_online_minutes.put(statDate,gameCommonStatDay.getAvg_online_minutes());
        }
        for (Do_game_retention_stat gameRetentionStat:gameRetentionStats){
            String statDate = DateUtil.getPartitionString(gameRetentionStat.getData_date());
            y_axis_retention_rate_1d.put(statDate,gameRetentionStat.getRetention_rate_1d());
            y_axis_retention_rate_7d.put(statDate,gameRetentionStat.getRetention_rate_7d());
            y_axis_retention_rate_30d.put(statDate,gameRetentionStat.getRetention_rate_30d());
            y_axis_retention_num_1d.put(statDate,gameRetentionStat.getRetention_num_1d());
            y_axis_retention_num_7d.put(statDate,gameRetentionStat.getRetention_num_7d());
            y_axis_retention_num_30d.put(statDate,gameRetentionStat.getRetention_num_30d());
        }
        Map<String, Object> axis = new HashMap<>();
        axis.put("avg_pay_rate", CommonUtil.FloatSet2Scale(avg_pay_rate));
        axis.put("avg_arpu", CommonUtil.FloatSet2Scale(avg_arpu));
        axis.put("avg_arppu", CommonUtil.FloatSet2Scale(avg_arppu));
        axis.put("avg_login_times", avg_login_times);
        axis.put("sum_online_minutes", sum_online_minutes);
        axis.put("x_axis", x_axis);
        axis.put("x_axis_retention", x_axis_retention);
        axis.put("y_axis_pay_rate", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_rate));
        axis.put("y_axis_arpu", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_arpu));
        axis.put("y_axis_arppu", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_arppu));
        axis.put("y_axis_avg_login_times", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_avg_login_times));
        axis.put("y_axis_avg_online_minutes", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_avg_online_minutes));
        axis.put("y_axis_retention_rate_1d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_rate_1d));
        axis.put("y_axis_retention_rate_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_rate_7d));
        axis.put("y_axis_retention_rate_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_rate_30d));
        axis.put("y_axis_retention_num_1d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_num_1d));
        axis.put("y_axis_retention_num_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_num_7d));
        axis.put("y_axis_retention_num_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis_retention,y_axis_retention_num_30d));

        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    public DataResult getOperationNewUser(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List newUserOltimeDistriList = mapperNewUserOltimeDistri.getNewUserOltimeDistriListByGameId(gameId, startDate, endDate);
        List newUserAreaDistriList = mapperNewUserAreaDistri.getNewUserAreaDistriListByGameId(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        newUserOltimeDistriList = setUserRate2UserDistri(newUserOltimeDistriList);
        newUserAreaDistriList = setUserRate2UserAreaDistri(newUserAreaDistriList);
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(), gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_newlogin_num = new HashMap<>();
        Map<String,Object> y_axis_pay_rate = new HashMap<>();
        Float avg_new_user = 0.0f;
        Float avg_pay_rate = 0.0f;
        Integer i = 1;

        for(Do_game_common_stat_day gameCommonStatDay : gameCommonStatDayList){
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            avg_new_user += (gameCommonStatDay.getNewlogin_num()-avg_new_user)/i;
            avg_pay_rate += (gameCommonStatDay.getPay_rate()-avg_pay_rate)/i;
            i++;
            y_axis_pay_rate.put(statDate,gameCommonStatDay.getFirst_day_pay_rate());
            y_axis_newlogin_num.put(statDate,gameCommonStatDay.getNewlogin_num());
        }
        List globalList = new ArrayList();
        List chinaList = new ArrayList();
        for(Object o:newUserAreaDistriList){
            Do_new_user_area_distri newUserAreaDistri = (Do_new_user_area_distri) o;
            if(newUserAreaDistri.getGlobal_classify().equals("global")){
                globalList.add(newUserAreaDistri);
            }else if(newUserAreaDistri.getGlobal_classify().equals("china")){
                chinaList.add(newUserAreaDistri);
            }
        }
        Map<String,Object> areaDistriMap = new HashMap<>();
        areaDistriMap.put("global",globalList);
        areaDistriMap.put("china",chinaList);

        Map<String, Object> axis = new HashMap<>();
        axis.put("x_axis", x_axis);
        axis.put("avg_new_user", CommonUtil.FloatSet2Scale(avg_new_user));
        axis.put("avg_pay_rate", CommonUtil.FloatSet2Scale(avg_pay_rate));
        axis.put("y_axis_newlogin_num", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_newlogin_num));
        axis.put("y_axis_pay_rate", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_rate));
        axis.put("new_user_oltime_distri", newUserOltimeDistriList);
        axis.put("area_distri",areaDistriMap);
        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    private List setUserRate2UserAreaDistri(List<Do_user_area_distri> userAreaDistriList) {
        Map<String,Float> totalUserNumMap = new HashMap<>();
        for(Do_user_area_distri userAreaDistri :userAreaDistriList){
            Float totalUserNum = totalUserNumMap.get(userAreaDistri.getGlobal_classify());
            if(null == totalUserNum){
                totalUserNum = 0.0f;
            }
            totalUserNumMap.put(userAreaDistri.getGlobal_classify(),totalUserNum+userAreaDistri.getUser_num());
        }
        List areaDistriList = new ArrayList();
        for(Do_user_area_distri userAreaDistri :userAreaDistriList){
            userAreaDistri.setUser_rate(calculateUserRate(userAreaDistri.getUser_num(),totalUserNumMap.get(userAreaDistri.getGlobal_classify())));
            areaDistriList.add(userAreaDistri);
        }
        return areaDistriList;
    }

    public DataResult getOperationActiveUser(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List loginUserOldaysDistriList = mapperLoginUserOldaysDistri.getLoginUserOldaysDistriListByGameId(gameId, startDate, endDate);
        List loginUserLevelDistriList = mapperLoginUserLevelDistri.getLoginUserLevelDistriListByGameId(gameId, startDate, endDate);
        List loginUserAreaDistriList = mapperLoginUserAreaDistri.getLoginUserAreaDistriListByGameId(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });

        loginUserOldaysDistriList = setUserRate2UserDistri(loginUserOldaysDistriList);
        loginUserLevelDistriList = setUserRate2UserDistri(loginUserLevelDistriList);
        loginUserAreaDistriList = setUserRate2UserAreaDistri(loginUserAreaDistriList);
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(), gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_dau = new HashMap<>();
        Map<String,Object> y_axis_wau = new HashMap<>();
        Map<String,Object> y_axis_mau = new HashMap<>();
        Float avg_dau = 0.0f;
        Float avg_wau = 0.0f;
        Float avg_mau = 0.0f;
        Integer i = 1;

        for(Do_game_common_stat_day gameCommonStatDay : gameCommonStatDayList){
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            avg_dau += (gameCommonStatDay.getLogin_num()-avg_dau)/i;
            avg_wau += (gameCommonStatDay.getWau()-avg_wau)/i;
            avg_mau += (gameCommonStatDay.getMau()-avg_mau)/i;
            i++;
            y_axis_dau.put(statDate,gameCommonStatDay.getLogin_num());
            y_axis_wau.put(statDate,gameCommonStatDay.getWau());
            y_axis_mau.put(statDate,gameCommonStatDay.getMau());
        }

        List globalList = new ArrayList();
        List chinaList = new ArrayList();
        for(Object o:loginUserAreaDistriList){
            Do_login_user_area_distri loginUserAreaDistri = (Do_login_user_area_distri) o;
            if(loginUserAreaDistri.getGlobal_classify().equals("global")){
                globalList.add(loginUserAreaDistri);
            }else if(loginUserAreaDistri.getGlobal_classify().equals("china")){
                chinaList.add(loginUserAreaDistri);
            }
        }
        Map<String,Object> areaDistriMap = new HashMap<>();
        areaDistriMap.put("global",globalList);
        areaDistriMap.put("china",chinaList);

        Map<String, Object> axis = new HashMap<>();
        axis.put("avg_dau", CommonUtil.FloatSet2Scale(avg_dau));
        axis.put("avg_wau", CommonUtil.FloatSet2Scale(avg_wau));
        axis.put("avg_mau", CommonUtil.FloatSet2Scale(avg_mau));
        axis.put("x_axis", x_axis);
        axis.put("y_axis_dau", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_dau));
        axis.put("y_axis_wau", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_wau));
        axis.put("y_axis_mau", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_mau));
        axis.put("login_user_oldays_distri", loginUserOldaysDistriList);
        axis.put("login_user_level_distri", loginUserLevelDistriList);
        axis.put("area_distri",areaDistriMap);
        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    private List setUserRate2UserDistri(List<Do_user_distri> userDistriList) {
        Float totalUserNum = 0.0f;
        for(Do_user_distri userDistri :userDistriList){
            totalUserNum += userDistri.getUser_num();
        }
        List userDistris = new ArrayList();
        for(Do_user_distri userDistri :userDistriList){
            userDistri.setUser_rate(calculateUserRate(userDistri.getUser_num(),totalUserNum));
            userDistris.add(userDistri);
        }
        return userDistris;
    }

    public DataResult getOperationRetentionUser(Integer gameId, String startDate, String endDate) {
        List<Do_game_retention_stat> gameRetentionStats = mapperGameRetentionStat.getGameRetentionStatListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_retention_user_logintimes_distri> retentionUserLogintimesDistriList = mapperRetentionUserLogintimesDistri.getRetentionUserLogintimesDistriListByGameId(gameId, startDate, endDate);
        List<Do_retention_user_oltime_distri> retentionUserOltimeDistriList = mapperRetentionUserOltimeDistri.getRetentionUserOltimeDistriListByGameId(gameId, startDate, endDate);
        List<Do_retention_user_level_distri> retentionUserLevelDistriList = mapperRetentionUserLevelDistri.getRetentionUserLevelDistriListByGameId(gameId, startDate, endDate);
        List<Do_retention_user_area_distri> retentionUserAreaDistriList = mapperRetentionUserAreaDistri.getRetentionUserAreaDistriListByGameId(gameId, startDate, endDate);
        Collections.sort(gameRetentionStats, new Comparator<Do_game_retention_stat>(){
            @Override
            public int compare(Do_game_retention_stat o1, Do_game_retention_stat o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        List<String> x_axis = new ArrayList<>();
        if(gameRetentionStats.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameRetentionStats.get(0).getData_date(), gameRetentionStats.get(gameRetentionStats.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_retention_rate_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_30d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_num_30d = new HashMap<>();

        for(Do_game_retention_stat gameRetentionStat : gameRetentionStats){
            String statDate = DateUtil.getPartitionString(gameRetentionStat.getData_date());
            y_axis_retention_rate_1d.put(statDate,gameRetentionStat.getRetention_rate_1d());
            y_axis_retention_rate_7d.put(statDate,gameRetentionStat.getRetention_rate_7d());
            y_axis_retention_rate_30d.put(statDate,gameRetentionStat.getRetention_rate_30d());
            y_axis_retention_num_1d.put(statDate,gameRetentionStat.getRetention_num_1d());
            y_axis_retention_num_7d.put(statDate,gameRetentionStat.getRetention_num_7d());
            y_axis_retention_num_30d.put(statDate,gameRetentionStat.getRetention_num_30d());
        }

        Map<String,Object> logintimesDistri = new HashMap<>();
        Map<String,Object> oltimeDistri = new HashMap<>();
        Map<String,Object> levelDistri = new HashMap<>();
        Map<String,Object> areaDistri = new HashMap<>();

        List axis_1d = new ArrayList();
        List axis_7d = new ArrayList();
        List axis_30d = new ArrayList();

        for(Do_retention_user_logintimes_distri retentionUserLogintimesDistri:retentionUserLogintimesDistriList){
            if(retentionUserLogintimesDistri.getRetention_classify().equals("1d")){
                axis_1d.add(retentionUserLogintimesDistri);
            }else if(retentionUserLogintimesDistri.getRetention_classify().equals("7d")){
                axis_7d.add(retentionUserLogintimesDistri);
            }if(retentionUserLogintimesDistri.getRetention_classify().equals("30d")){
                axis_30d.add(retentionUserLogintimesDistri);
            }
        }
        axis_1d = setUserRate2UserDistri(axis_1d);
        axis_7d = setUserRate2UserDistri(axis_7d);
        axis_30d = setUserRate2UserDistri(axis_30d);
        logintimesDistri.put("1d",axis_1d);
        logintimesDistri.put("7d",axis_7d);
        logintimesDistri.put("30d",axis_30d);

        axis_1d = new ArrayList();
        axis_7d = new ArrayList();
        axis_30d = new ArrayList();

        for(Do_retention_user_oltime_distri retentionUserOltimeDistri:retentionUserOltimeDistriList){
            if(retentionUserOltimeDistri.getRetention_classify().equals("1d")){
                axis_1d.add(retentionUserOltimeDistri);
            }else if(retentionUserOltimeDistri.getRetention_classify().equals("7d")){
                axis_7d.add(retentionUserOltimeDistri);
            }if(retentionUserOltimeDistri.getRetention_classify().equals("30d")){
                axis_30d.add(retentionUserOltimeDistri);
            }
        }
        axis_1d = setUserRate2UserDistri(axis_1d);
        axis_7d = setUserRate2UserDistri(axis_7d);
        axis_30d = setUserRate2UserDistri(axis_30d);
        oltimeDistri.put("1d",axis_1d);
        oltimeDistri.put("7d",axis_7d);
        oltimeDistri.put("30d",axis_30d);

        axis_1d = new ArrayList();
        axis_7d = new ArrayList();
        axis_30d = new ArrayList();

        for(Do_retention_user_level_distri retentionUserLevelDistri:retentionUserLevelDistriList){
            if(retentionUserLevelDistri.getRetention_classify().equals("1d")){
                axis_1d.add(retentionUserLevelDistri);
            }else if(retentionUserLevelDistri.getRetention_classify().equals("7d")){
                axis_7d.add(retentionUserLevelDistri);
            }if(retentionUserLevelDistri.getRetention_classify().equals("30d")){
                axis_30d.add(retentionUserLevelDistri);
            }
        }
        axis_1d = setUserRate2UserDistri(axis_1d);
        axis_7d = setUserRate2UserDistri(axis_7d);
        axis_30d = setUserRate2UserDistri(axis_30d);
        levelDistri.put("1d",axis_1d);
        levelDistri.put("7d",axis_7d);
        levelDistri.put("30d",axis_30d);

        Map<String,Object> area_axis_1d = new HashMap<>();
        Map<String,Object> area_axis_7d = new HashMap<>();
        Map<String,Object> area_axis_30d = new HashMap<>();

        for(Do_retention_user_area_distri retentionUserAreaDistri:retentionUserAreaDistriList){
            if(retentionUserAreaDistri.getRetention_classify().equals("1d")){
                area_axis_1d = separateAreaDistri(retentionUserAreaDistri,area_axis_1d);
            }else if(retentionUserAreaDistri.getRetention_classify().equals("7d")){
                area_axis_7d = separateAreaDistri(retentionUserAreaDistri,area_axis_7d);
            }if(retentionUserAreaDistri.getRetention_classify().equals("30d")){
                area_axis_30d = separateAreaDistri(retentionUserAreaDistri,area_axis_30d);
            }
        }
        areaDistri.put("1d",area_axis_1d);
        areaDistri.put("7d",area_axis_7d);
        areaDistri.put("30d",area_axis_30d);

        Map<String, Object> axis = new HashMap<>();
        axis.put("x_axis", x_axis);
        axis.put("y_axis_retention_rate_1d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_1d));
        axis.put("y_axis_retention_rate_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_7d));
        axis.put("y_axis_retention_rate_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_30d));
        axis.put("y_axis_retention_num_1d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_num_1d));
        axis.put("y_axis_retention_num_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_num_7d));
        axis.put("y_axis_retention_num_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_num_30d));
        axis.put("logintimes_distri", logintimesDistri);
        axis.put("level_distri", levelDistri);
        axis.put("oltime_distri", oltimeDistri);
        axis.put("area_distri",areaDistri);
        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    private Map<String,Object> separateAreaDistri(Do_user_area_distri userAreaDistri,Map<String,Object> area_axis){
        if(userAreaDistri.getGlobal_classify().equals("global")){
            List globalList = CommonUtil.Object2List(area_axis.get("global"));
            globalList.add(userAreaDistri);
            area_axis.put("global",globalList);
        }else if(userAreaDistri.getGlobal_classify().equals("china")){
            List chinalList =  CommonUtil.Object2List(area_axis.get("china"));
            chinalList.add(userAreaDistri);
            area_axis.put("china",chinalList);
        }
        List globalList = CommonUtil.Object2List(area_axis.get("global"));
        List chinalList =  CommonUtil.Object2List(area_axis.get("china"));
        globalList = setUserRate2UserAreaDistri(globalList);
        chinalList = setUserRate2UserAreaDistri(chinalList);
        area_axis.put("global",globalList);
        area_axis.put("china",chinalList);
        return area_axis;
    }

    public DataResult getOperationPayUser(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_pay_user_area_distri> payUserAreaDistris = mapperPayUserAreaDistri.getPayUserAreaDistriListByGameId(gameId, startDate, endDate);
        List<Do_pay_user_level_distri> payUserLevelDistris = mapperPayUserLevelDistri.getPayUserLevelDistriListByGameId(gameId, startDate, endDate);
        List<Do_pay_user_oldays_distri> payUserOldaysDistris = mapperPayUserOldaysDistri.getPayUserOldaysDistriListByGameId(gameId, startDate, endDate);
        List<Do_pay_user_oltime_distri> payUserOltimeDistris = mapperPayUserOltimeDistri.getPayUserOltimeDistriListByGameId(gameId, startDate, endDate);
        List<Do_pay_user_potential_lost_stat> payUserPotentialLostDistris = mapperPayUserPotentialLostStat.getPayUserPotentialLostDistriListByGameId(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(), gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_first_pay = new HashMap<>();
        Map<String,Object> y_axis_first_day_pay = new HashMap<>();
        Map<String,Object> y_axis_pay = new HashMap<>();
        Map<String,Object> y_axis_pay_again = new HashMap<>();
        Map<String,Object> y_axis_potential_pay = new HashMap<>();

        Float avg_first_pay_user = 0.0f;
        Float avg_pay_user = 0.0f;
        Float avg_potential_pay = 0.0f;
        Integer i = 1;

        for(Do_game_common_stat_day gameCommonStatDay : gameCommonStatDayList){
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            avg_first_pay_user += (gameCommonStatDay.getFirst_pay_num()-avg_first_pay_user)/i;
            avg_pay_user += (gameCommonStatDay.getPay_num()-avg_pay_user)/i;
            avg_potential_pay += (gameCommonStatDay.getPotential_pay_num()-avg_potential_pay)/i;
            i++;

            y_axis_first_pay.put(statDate,gameCommonStatDay.getFirst_pay_num());
            y_axis_first_day_pay.put(statDate,gameCommonStatDay.getFirst_day_pay_num());
            y_axis_pay.put(statDate,gameCommonStatDay.getPay_num());
            y_axis_pay_again.put(statDate,gameCommonStatDay.getPay_again_num());
            y_axis_potential_pay.put(statDate,gameCommonStatDay.getPotential_pay_num());
        }

        Map<String,Object> userAreaDistri = new HashMap<>();
        Map<String,Object> paidUserAreaDistri = new HashMap<>();
        Map<String,Object> potentialUserAreaDistri = new HashMap<>();
        for(Do_pay_user_area_distri payUserAreaDistri:payUserAreaDistris){
            if("paid".equals(payUserAreaDistri.getUser_type())){
                paidUserAreaDistri = separateAreaDistri(payUserAreaDistri,paidUserAreaDistri);
            }else {
                potentialUserAreaDistri = separateAreaDistri(payUserAreaDistri,potentialUserAreaDistri);
            }
        }
        userAreaDistri.put("paid",paidUserAreaDistri);
        userAreaDistri.put("potential",potentialUserAreaDistri);

        Map<String,Object> userLevelDistri = new HashMap<>();
        List potentialPayLevels = new ArrayList();
        List payLevels = new ArrayList();
        for(Do_pay_user_level_distri payUserLevelDistri:payUserLevelDistris){
            if("paid".equals(payUserLevelDistri.getUser_type())){
                payLevels.add(payUserLevelDistri);
            }else {
                potentialPayLevels.add(payUserLevelDistri);
            }
        }
        potentialPayLevels = setUserRate2UserDistri(potentialPayLevels);
        payLevels = setUserRate2UserDistri(payLevels);
        userLevelDistri.put("paid",payLevels);
        userLevelDistri.put("potential_pay",potentialPayLevels);

        Map<String,Object> userOltimeDistri = new HashMap<>();
        List potentialOltimeLevels = new ArrayList();
        List oltimeLevels = new ArrayList();
        for(Do_pay_user_oltime_distri payUserOltimeDistri:payUserOltimeDistris){
            if("paid".equals(payUserOltimeDistri.getUser_type())){
                oltimeLevels.add(payUserOltimeDistri);
            }else {
                potentialOltimeLevels.add(payUserOltimeDistri);
            }
        }
        oltimeLevels = setUserRate2UserDistri(oltimeLevels);
        potentialOltimeLevels = setUserRate2UserDistri(potentialOltimeLevels);
        userOltimeDistri.put("paid",oltimeLevels);
        userOltimeDistri.put("potential_pay",potentialOltimeLevels);

        Map<String,Object> userOldaysDistri = new HashMap<>();
        List potentialLevels = new ArrayList();
        List oldaysLevels = new ArrayList();
        for(Do_pay_user_oldays_distri payUserOldaysDistri:payUserOldaysDistris){
            if("paid".equals(payUserOldaysDistri.getUser_type())){
                oldaysLevels.add(payUserOldaysDistri);
            }else {
                potentialLevels.add(payUserOldaysDistri);
            }
        }
        oldaysLevels = setUserRate2UserDistri(oldaysLevels);
        potentialLevels = setUserRate2UserDistri(potentialLevels);
        userOldaysDistri.put("paid",oldaysLevels);
        userOldaysDistri.put("potential_pay",potentialLevels);

        List userPotentialLostDistri = new ArrayList();
        for(Do_pay_user_potential_lost_stat payUserPotentialLostDistri:payUserPotentialLostDistris){
            userPotentialLostDistri.add(payUserPotentialLostDistri);
        }

        Map<String, Object> axis = new HashMap<>();
        axis.put("avg_first_pay_user", CommonUtil.FloatSet2Scale(avg_first_pay_user));
        axis.put("avg_pay_user", CommonUtil.FloatSet2Scale(avg_pay_user));
        axis.put("avg_potential_pay", CommonUtil.FloatSet2Scale(avg_potential_pay));
        axis.put("x_axis", x_axis);
        axis.put("y_axis_first_pay", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_first_pay));
        axis.put("y_axis_first_day_pay", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_first_day_pay));
        axis.put("y_axis_pay", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay));
        axis.put("y_axis_pay_again", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_again));
        axis.put("y_axis_potential_pay", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_potential_pay));
        axis.put("pay_user_area_distri", userAreaDistri);
        axis.put("pay_user_level_distri", userLevelDistri);
        axis.put("pay_user_oltime_distri", userOltimeDistri);
        axis.put("pay_user_oldays_distri", userOldaysDistri);
        axis.put("pay_user_potential_lost_distri", userPotentialLostDistri);
        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    public DataResult getOperationLostUser(Integer gameId, String startDate, String endDate) {
        List<Do_lost_user_common_analysis> lostUserCommonAnalysisList = mapperLostUserCommonAnalysis.getLostUserCommonAnalysisListByGameIdAndDate(gameId, startDate, endDate);
        List<String> x_axis = new ArrayList<>();
        if(lostUserCommonAnalysisList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(lostUserCommonAnalysisList.get(0).getData_date(), lostUserCommonAnalysisList.get(lostUserCommonAnalysisList.size() - 1).getData_date());
        }
        Map y_axis = new HashMap();

        Map<String,Object> y_axis_with_map = new HashMap<>();

        Float avg_analysis = 0.0f;
        Integer i = 1;
        for(Do_lost_user_common_analysis lostUserCommonAnalysis:lostUserCommonAnalysisList){
            String date = DateUtil.getPartitionString(lostUserCommonAnalysis.getData_date());

            y_axis_with_map = separateLostUserCommon(lostUserCommonAnalysis,y_axis_with_map);
        }
        for(Map.Entry<String,Object> lostTypeEntry : y_axis_with_map.entrySet()){
            String lostType = lostTypeEntry.getKey();
            Map<String,Object> userTypeMap = (Map<String, Object>) lostTypeEntry.getValue();
            Map<String,Object> newUserTypeMap = new HashMap<>();
            for(Map.Entry<String,Object> userTypeEntry : userTypeMap.entrySet()){
                String userType = userTypeEntry.getKey();
                Map<String,Object> dateValMap = (Map<String, Object>) userTypeEntry.getValue();
                List<Object> dateValList = CommonUtil.getXAxisDataWithYAxisMap(x_axis,dateValMap);
                newUserTypeMap.put(userType,dateValList);
            }
            y_axis.put(lostType,newUserTypeMap);
        }

        Set y_axis_set = y_axis.keySet();
        Map avg = new HashMap<>();
        for(Object key : y_axis_set){
            List lostUserAnalysisList = (List) (((Map)y_axis.get(key)).get("paid"));
            avg_analysis = 0.0f;
            i = 1;
            for (Object userCommonAnalysisObj:lostUserAnalysisList){
                avg_analysis += ((Integer)userCommonAnalysisObj-avg_analysis)/i;
                i++;
            }
            avg.put(key,Math.ceil(avg_analysis));
        }

        List<Do_lost_user_oldays_distri> lostUserOldaysDistriList = mapperLostUserOldaysDistri.getLostUserOldaysDistriListByGameId(gameId, startDate, endDate);
        Map<String,Object> lostUserOldays = new HashMap<>();
        for(Do_lost_user_oldays_distri lostUserOldaysDistri:lostUserOldaysDistriList){
            List lostUser = CommonUtil.Object2List(lostUserOldays.get(lostUserOldaysDistri.getUser_type()));
            lostUser.add(lostUserOldaysDistri);
            lostUserOldays.put(lostUserOldaysDistri.getUser_type(),lostUser);
        }
        Set keys = lostUserOldays.keySet();
        for(Object key : keys){
            List lostUser = (List) lostUserOldays.get(key);
            lostUser = setUserRate2UserDistri(lostUser);
            lostUserOldays.put(key.toString(),lostUser);
        }

        List<Do_lost_user_level_distri> lostUserLevelDistriList = mapperLostUserLevelDistri.getLostUserLevelDistriListByGameId(gameId, startDate, endDate);
        Map<String,Object> lostUserLevel = new HashMap<>();
        for(Do_lost_user_level_distri lostUserLevelDistri:lostUserLevelDistriList){
            List lostUser = CommonUtil.Object2List(lostUserLevel.get(lostUserLevelDistri.getUser_type()));
            lostUser.add(lostUserLevelDistri);
            lostUserLevel.put(lostUserLevelDistri.getUser_type(),lostUser);
        }
        keys = lostUserLevel.keySet();
        for(Object key : keys){
            List lostUser = (List) lostUserLevel.get(key);
            lostUser = setUserRate2UserDistri(lostUser);
            lostUserLevel.put(key.toString(),lostUser);
        }

        List<Do_lost_user_pay_distri> lostUserPayDistriList = mapperLostUserPayDistri.getLostUserPayDistriListByGameId(gameId, startDate, endDate);
        Map<String,Object> lostUserPay = new HashMap<>();
        for(Do_lost_user_pay_distri lostUserPayDistri:lostUserPayDistriList){
            List lostUser = CommonUtil.Object2List(lostUserPay.get(lostUserPayDistri.getUser_type()));
            lostUser.add(lostUserPayDistri);
            lostUserPay.put(lostUserPayDistri.getUser_type(),lostUser);
        }
        keys = lostUserPay.keySet();
        for(Object key : keys){
            List lostUser = (List) lostUserPay.get(key);
            lostUser = setUserRate2UserDistri(lostUser);
            lostUserPay.put(key.toString(),lostUser);
        }

        List<Do_lost_user_area_distri> lostUserAreaDistriList = mapperLostUserAreaDistri.getLostUserAreaDistriListByGameId(gameId, startDate, endDate);
        Map<String,Object> lostUserArea  = new HashMap<>();
        for(Do_lost_user_area_distri lostUserAreaDistri : lostUserAreaDistriList){
            lostUserArea = separateAreaDistri(lostUserAreaDistri,lostUserArea);
        }

        Map<String, Object> axis = new HashMap<>();
        axis.put("avg", avg);
        axis.put("x_axis", x_axis);
        axis.put("y_axis", y_axis);
        axis.put("lost_user_oldays", lostUserOldays);
        axis.put("lost_user_level", lostUserLevel);
        axis.put("lost_user_pay", lostUserPay);
        axis.put("lost_user_area", lostUserArea);

        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    private Map<String,Object> separateLostUserCommon(Do_lost_user_common_analysis lostUserCommonAnalysis,Map<String,Object> y_axis){
        Map<String,Object> userTypeMap = null;
        if(null != y_axis.get(lostUserCommonAnalysis.getLost_type())){
            userTypeMap = (Map<String, Object>) y_axis.get(lostUserCommonAnalysis.getLost_type());
        }else {
            userTypeMap = new HashMap<>();
        }
        Map<String,Object> lostUserCommonAnalysises = null;
        Object lostUser = userTypeMap.get(lostUserCommonAnalysis.getUser_type());
        if(null != lostUser){
            lostUserCommonAnalysises = (Map) lostUser;
        }else {
            lostUserCommonAnalysises = new HashMap<>();
        }
        lostUserCommonAnalysises.put(DateUtil.getPartitionString(lostUserCommonAnalysis.getData_date()),lostUserCommonAnalysis.getUser_num());
        userTypeMap.put(lostUserCommonAnalysis.getUser_type(),lostUserCommonAnalysises);
        y_axis.put(lostUserCommonAnalysis.getLost_type(),userTypeMap);
        return y_axis;
    }

    public DataResult getOperationHabitUser(Integer gameId, String startDate, String endDate) {
        List<Do_user_habit_play_time_stat> userHabitPlayTimeStatDayList = mapperUserHabitPlayTimeStat.getUserHabitPlayTimeStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_user_habit_play_time_stat> userHabitPlayTimeStatWeekList = mapperUserHabitPlayTimeStat.getUserHabitPlayTimeStatWeekListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_user_habit_play_time_stat> userHabitPlayTimeStatMonthList = mapperUserHabitPlayTimeStat.getUserHabitPlayTimeStatMonthListByGameIdAndDate(gameId, startDate, endDate);

        List<Do_user_habit_freq_week_distri> userHabitFreqWeekDistriList = mapperUserHabitFreqWeekDistri.getUserHabitFreqWeekDistriListByGame(gameId, startDate, endDate);
        List<Do_user_habit_oltime_distri> userHabitOltimeDistriList = mapperUserHabitOltimeDistri.getUserHabitOltimeDistriListByGame(gameId, startDate, endDate);
        List<Do_user_habit_olslot_distri> userHabitOlslotDistriList = mapperUserHabitOlslotDistri.getUserHabitOlslotDistriListByGame(gameId, startDate, endDate);
        List<Do_user_habit_device_distri> userHabitDeviceDistriList = mapperUserHabitDeviceDistri.getUserHabitDeviceDistriListByGame(gameId, startDate, endDate);

        Map<String,Object> habitPlayDay = separateHabitUserPlay(userHabitPlayTimeStatDayList);
        Map<String,Object> habitPlayWeek = separateHabitUserPlay(userHabitPlayTimeStatWeekList);
        Map<String,Object> habitPlayMonth = separateHabitUserPlay(userHabitPlayTimeStatMonthList);

        Map<String,Object> hibitFreqWeek = separateHabitFreqWeek(userHabitFreqWeekDistriList);
        Map<String,Object> hibitOltime = separateHabitOltime(userHabitOltimeDistriList);
        Map<String,Object> hibitOlslot = separateHabitOlslot(userHabitOlslotDistriList);
        Map<String,Object> hibitDevice = separateHabitDevice(userHabitDeviceDistriList);

        Map<String, Object> axis = new HashMap<>();
        axis.put("user_habit_day", habitPlayDay);
        axis.put("user_habit_week", habitPlayWeek);
        axis.put("user_habit_month", habitPlayMonth);
        axis.put("user_habit_freq", hibitFreqWeek);
        axis.put("user_habit_oltime", hibitOltime);
        axis.put("user_habit_olslot", hibitOlslot);
        axis.put("user_habit_device", hibitDevice);

        return new DataResult(ReturnCodeDim.SUCCESS,axis);
    }

    private Map<String, Object> separateHabitDevice(List<Do_user_habit_device_distri> userHabitDeviceDistriList) {
        Map<String,Object> hibitDevice = new HashMap<>();
        Map<String,Float> totalNum = new HashMap<>();
        for(Do_user_habit_device_distri userHabitDeviceDistri:userHabitDeviceDistriList){
            Float userNum = totalNum.get(userHabitDeviceDistri.getUser_type());
            if(null == userNum){
                userNum = 0.0f;
            }
            totalNum.put(userHabitDeviceDistri.getUser_type(),userNum+userHabitDeviceDistri.getUser_num());
        }
        for(Do_user_habit_device_distri userHabitDeviceDistri:userHabitDeviceDistriList){
            Map data = CommonUtil.Object2Map(hibitDevice.get(userHabitDeviceDistri.getUser_type()));
            String distri_classify = userHabitDeviceDistri.getDistri_classify();
            List x_axis = CommonUtil.Object2List(data.get("distri_classify"));
            if(!x_axis.contains(distri_classify)) {
                x_axis.add(distri_classify);
            }
            Map y_axis = CommonUtil.Object2Map(data.get("y_axis"));
            List user_num = CommonUtil.Object2List(y_axis.get("user_num"));
            List user_rate = CommonUtil.Object2List(y_axis.get("user_rate"));
            user_num.add(userHabitDeviceDistri.getUser_num());
            user_rate.add(calculateUserRate(userHabitDeviceDistri.getUser_num(),totalNum.get(userHabitDeviceDistri.getUser_type())));
            y_axis.put("user_num",user_num);
            y_axis.put("user_rate",user_rate);
            data.put("distri_classify",x_axis);
            data.put("y_axis",y_axis);
            hibitDevice.put(userHabitDeviceDistri.getUser_type(),data);
        }
        return hibitDevice;
    }

    private Map<String, Object> separateHabitOlslot(List<Do_user_habit_olslot_distri> userHabitOlslotDistriList) {
        Map<String,Object> hibitOlslot = new HashMap<>();

        Map<String,Float> totalNum = new HashMap<>();
        for(Do_user_habit_olslot_distri userHabitOlslotDistri:userHabitOlslotDistriList){
            Float userNum = totalNum.get(userHabitOlslotDistri.getUser_type());
            if(null == userNum){
                userNum = 0.0f;
            }
            totalNum.put(userHabitOlslotDistri.getUser_type(),userNum+userHabitOlslotDistri.getUser_num());
        }
        for(Do_user_habit_olslot_distri userHabitOlslotDistri:userHabitOlslotDistriList){
            Map data = CommonUtil.Object2Map(hibitOlslot.get(userHabitOlslotDistri.getUser_type()));
            String distri_classify = userHabitOlslotDistri.getDistri_classify();
            List x_axis = CommonUtil.Object2List(data.get("distri_classify"));
            if(!x_axis.contains(distri_classify)) {
                x_axis.add(distri_classify);
            }
            Map y_axis = CommonUtil.Object2Map(data.get("y_axis"));
            List user_num = CommonUtil.Object2List(y_axis.get("user_num"));
            List user_rate = CommonUtil.Object2List(y_axis.get("user_rate"));
            user_num.add(userHabitOlslotDistri.getUser_num());
            user_rate.add(calculateUserRate(userHabitOlslotDistri.getUser_num(),totalNum.get(userHabitOlslotDistri.getUser_type())));
            y_axis.put("user_num",user_num);
            y_axis.put("user_rate",user_rate);
            data.put("distri_classify",x_axis);
            data.put("y_axis",y_axis);
            hibitOlslot.put(userHabitOlslotDistri.getUser_type(),data);
        }
        return hibitOlslot;
    }

    private Map<String, Object> separateHabitOltime(List<Do_user_habit_oltime_distri> userHabitOltimeDistriList) {
        Map<String,Object> hibitOltime = new HashMap<>();
        Map<String,Float> totalNum = new HashMap<>();
        for(Do_user_habit_oltime_distri userHabitOltimeDistri:userHabitOltimeDistriList){
            Float userNum = totalNum.get(userHabitOltimeDistri.getStat_type()+userHabitOltimeDistri.getUser_type());
            if(null == userNum){
                userNum = 0.0f;
            }
            totalNum.put(userHabitOltimeDistri.getStat_type()+userHabitOltimeDistri.getUser_type(),userNum+userHabitOltimeDistri.getUser_num());
        }
        for(Do_user_habit_oltime_distri userHabitOltimeDistri:userHabitOltimeDistriList){
            Map data = CommonUtil.Object2Map(hibitOltime.get(userHabitOltimeDistri.getStat_type()));
            String distri_classify = userHabitOltimeDistri.getDistri_classify();
            List x_axis = CommonUtil.Object2List(data.get("distri_classify"));
            if(!x_axis.contains(distri_classify)) {
                x_axis.add(distri_classify);
            }
            Map y_axis = CommonUtil.Object2Map(data.get(userHabitOltimeDistri.getUser_type()));
            List user_num = CommonUtil.Object2List(y_axis.get("user_num"));
            List user_rate = CommonUtil.Object2List(y_axis.get("user_rate"));
            user_num.add(userHabitOltimeDistri.getUser_num());
            user_rate.add(calculateUserRate(userHabitOltimeDistri.getUser_num(),totalNum.get(userHabitOltimeDistri.getStat_type()+userHabitOltimeDistri.getUser_type())));
            y_axis.put("user_num",user_num);
            y_axis.put("user_rate",user_rate);
            data.put("distri_classify",x_axis);
            data.put(userHabitOltimeDistri.getUser_type(),y_axis);
            hibitOltime.put(userHabitOltimeDistri.getStat_type(),data);
        }
        return hibitOltime;
    }

    private Map<String, Object> separateHabitFreqWeek(List<Do_user_habit_freq_week_distri> user_habit_freq_week_distriList) {
        Map<String,Object> habitFreq = new HashMap<>();
        Map<String,Float> totalNum = new HashMap<>();
        for(Do_user_habit_freq_week_distri userHabitFreqWeekDistri:user_habit_freq_week_distriList){
            Float userNum = totalNum.get(userHabitFreqWeekDistri.getStat_type()+userHabitFreqWeekDistri.getUser_type());
            if(null == userNum ){
                userNum = 0.0f;
            }
            totalNum.put(userHabitFreqWeekDistri.getStat_type()+userHabitFreqWeekDistri.getUser_type(),userNum+userHabitFreqWeekDistri.getUser_num());
        }

        for(Do_user_habit_freq_week_distri userHabitFreqWeekDistri:user_habit_freq_week_distriList){
            Map data = CommonUtil.Object2Map(habitFreq.get(userHabitFreqWeekDistri.getStat_type()));
            String distri_classify = userHabitFreqWeekDistri.getDistri_classify();
            List x_axis = CommonUtil.Object2List(data.get("distri_classify"));
            if(!x_axis.contains(distri_classify)) {
                x_axis.add(distri_classify);
            }
            Map y_axis = CommonUtil.Object2Map(data.get(userHabitFreqWeekDistri.getUser_type()));
            List user_num = CommonUtil.Object2List(y_axis.get("user_num"));
            List user_rate = CommonUtil.Object2List(y_axis.get("user_rate"));
            user_num.add(userHabitFreqWeekDistri.getUser_num());
            user_rate.add(calculateUserRate(userHabitFreqWeekDistri.getUser_num(),totalNum.get(userHabitFreqWeekDistri.getStat_type()+userHabitFreqWeekDistri.getUser_type())));
            y_axis.put("user_num",user_num);
            y_axis.put("user_rate",user_rate);
            data.put("distri_classify",x_axis);
            data.put(userHabitFreqWeekDistri.getUser_type(),y_axis);
            habitFreq.put(userHabitFreqWeekDistri.getStat_type(),data);
        }
        return habitFreq;
    }

    private Map<String,Object> separateHabitUserPlay(List<Do_user_habit_play_time_stat> userHabitPlayTimeStatList){
        Map<String,Object> habitPlay = new HashMap<>();
        for(Do_user_habit_play_time_stat userHabitPlayTimeStatDay:userHabitPlayTimeStatList){
            String date = DateUtil.getPartitionString(userHabitPlayTimeStatDay.getData_date());
            List x_axis = CommonUtil.Object2List(habitPlay.get("x_axis"));
            if(!x_axis.contains(date)) {
                x_axis.add(date);
            }
            Map y_axis = CommonUtil.Object2Map(habitPlay.get(userHabitPlayTimeStatDay.getUser_type()));
            List login_times = CommonUtil.Object2List(y_axis.get("login_times"));
            List online_time = CommonUtil.Object2List(y_axis.get("online_time"));
            login_times.add(userHabitPlayTimeStatDay.getLogin_times());
            online_time.add(userHabitPlayTimeStatDay.getOnline_time());
            y_axis.put("login_times",login_times);
            y_axis.put("online_time",online_time);
            habitPlay.put("x_axis",x_axis);
            habitPlay.put(userHabitPlayTimeStatDay.getUser_type(),y_axis);
        }
        return habitPlay;
    }

    private Float calculateUserRate(Float user_num,Float toatl_num){
        if(toatl_num <= 0){
            return 0.0f;
        }
        Float user_rate = Float.valueOf(user_num*100+"")/toatl_num;
        BigDecimal bigDecimal = new BigDecimal((double)user_rate);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public DataResult getOperationHabitCount(Integer gameId, String startDate, String endDate) {
        List<Do_game_retention_stat> gameRetentionStats = mapperGameRetentionStat.getGameRetentionStatListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_game_common_stat_day> gameCommonStatDays = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId,startDate,endDate);
        Collections.sort(gameRetentionStats, new Comparator<Do_game_retention_stat>(){
            @Override
            public int compare(Do_game_retention_stat o1, Do_game_retention_stat o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        Collections.sort(gameCommonStatDays, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDays.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDays.get(0).getData_date(), gameCommonStatDays.get(gameCommonStatDays.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_newlogin_num = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_30d = new HashMap<>();
        for(Do_game_common_stat_day gameCommonStat : gameCommonStatDays){
            String statDate = DateUtil.getPartitionString(gameCommonStat.getData_date());
            y_axis_newlogin_num.put(statDate,gameCommonStat.getNewlogin_num());
        }
        for(Do_game_retention_stat gameRetentionStat : gameRetentionStats){
            String statDate = DateUtil.getPartitionString(gameRetentionStat.getData_date());
            y_axis_retention_rate_1d.put(statDate,gameRetentionStat.getRetention_rate_1d());
            y_axis_retention_rate_7d.put(statDate,gameRetentionStat.getRetention_rate_7d());
            y_axis_retention_rate_30d.put(statDate,gameRetentionStat.getRetention_rate_30d());
        }
        Map<String, Object> game_retention = new HashMap<>();
        game_retention.put("x_axis", x_axis);
        game_retention.put("y_axis_newlogin_num", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_newlogin_num));
        game_retention.put("y_axis_retention_rate_1d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_1d));
        game_retention.put("y_axis_retention_rate_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_7d));
        game_retention.put("y_axis_retention_rate_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_retention_rate_30d));


        List<Do_retention_custom_analysis_day> retentionCustomAnalysisDayList = mapperRetentionCustomAnalysis.getRetentionCustomAnalysisDayListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_retention_custom_analysis_week> retentionCustomAnalysisWeekList = mapperRetentionCustomAnalysis.getRetentionCustomAnalysisWeekListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_retention_custom_analysis_month> retentionCustomAnalysisMonthList = mapperRetentionCustomAnalysis.getRetentionCustomAnalysisMonthListByGameIdAndDate(gameId, startDate, endDate);

        Map<String,Object> retentionAnalysisDay = retentionAnalysisDayData(retentionCustomAnalysisDayList);
        Map<String,Object> retentionAnalysisDayNum = retentionAnalysisDayDataNum(retentionCustomAnalysisDayList);
        Map<String,Object> retentionAnalysisWeek = retentionAnalysisWeekData(retentionCustomAnalysisWeekList);
        Map<String,Object> retentionAnalysisWeekNum = retentionAnalysisWeekDataNum(retentionCustomAnalysisWeekList);
        Map<String,Object> retentionAnalysisMonth = retentionAnalysisMonthData(retentionCustomAnalysisMonthList);
        Map<String,Object> retentionAnalysisMonthNum = retentionAnalysisMonthDataNum(retentionCustomAnalysisMonthList);

        Map<String,Object> retention_custom = new HashMap<>();
        retention_custom.put("retention_custom_day",retentionAnalysisDay);
        retention_custom.put("retention_custom_day_num",retentionAnalysisDayNum);
        retention_custom.put("retention_custom_week",retentionAnalysisWeek);
        retention_custom.put("retention_custom_week_num",retentionAnalysisWeekNum);
        retention_custom.put("retention_custom_month",retentionAnalysisMonth);
        retention_custom.put("retention_custom_month_num",retentionAnalysisMonthNum);

        Map<String,Object> result = new HashMap<>();
        result.put("game_retention",game_retention);
        result.put("retention_custom",retention_custom);

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    private Map<String,Object> retentionAnalysisDayData(List<Do_retention_custom_analysis_day> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_day retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisData = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));
            Map<String,Object> data = new HashMap<>();
            data.put("data_date",DateUtil.getPartitionString(retentionCustomAnalysis.getData_date()));
            data.put("user_num",retentionCustomAnalysis.getUser_num());
            data.put("rate_1d",retentionCustomAnalysis.getRate_1d());
            data.put("rate_2d",retentionCustomAnalysis.getRate_2d());
            data.put("rate_3d",retentionCustomAnalysis.getRate_3d());
            data.put("rate_4d",retentionCustomAnalysis.getRate_4d());
            data.put("rate_5d",retentionCustomAnalysis.getRate_5d());
            data.put("rate_6d",retentionCustomAnalysis.getRate_6d());
            data.put("rate_7d",retentionCustomAnalysis.getRate_7d());
            data.put("rate_14d",retentionCustomAnalysis.getRate_14d());
            data.put("rate_30d",retentionCustomAnalysis.getRate_30d());
            retentionAnalysisData.add(data);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisData);
        }
        return retentionAnalysis;
    }

    private Map<String,Object> retentionAnalysisWeekData(List<Do_retention_custom_analysis_week> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_week retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisData = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));
            Map<String,Object> data = new HashMap<>();
            data.put("data_date",retentionCustomAnalysis.getDate_type());
            data.put("user_num",retentionCustomAnalysis.getUser_num());
            data.put("rate_1w",retentionCustomAnalysis.getRate_1w());
            data.put("rate_2w",retentionCustomAnalysis.getRate_2w());
            data.put("rate_3w",retentionCustomAnalysis.getRate_3w());
            data.put("rate_4w",retentionCustomAnalysis.getRate_4w());
            data.put("rate_5w",retentionCustomAnalysis.getRate_5w());
            data.put("rate_6w",retentionCustomAnalysis.getRate_6w());
            data.put("rate_7w",retentionCustomAnalysis.getRate_7w());
            data.put("rate_8w",retentionCustomAnalysis.getRate_8w());
            data.put("rate_9w",retentionCustomAnalysis.getRate_9w());
            retentionAnalysisData.add(data);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisData);
        }
        return retentionAnalysis;
    }

    private Map<String,Object> retentionAnalysisMonthData(List<Do_retention_custom_analysis_month> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_month retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisData = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));
            Map<String,Object> data = new HashMap<>();
            data.put("data_date",retentionCustomAnalysis.getDate_type());
            data.put("user_num",retentionCustomAnalysis.getUser_num());
            data.put("rate_1m",retentionCustomAnalysis.getRate_1m());
            data.put("rate_2m",retentionCustomAnalysis.getRate_2m());
            data.put("rate_3m",retentionCustomAnalysis.getRate_3m());
            data.put("rate_4m",retentionCustomAnalysis.getRate_4m());
            data.put("rate_5m",retentionCustomAnalysis.getRate_5m());
            data.put("rate_6m",retentionCustomAnalysis.getRate_6m());
            data.put("rate_7m",retentionCustomAnalysis.getRate_7m());
            data.put("rate_8m",retentionCustomAnalysis.getRate_8m());
            data.put("rate_9m",retentionCustomAnalysis.getRate_9m());
            retentionAnalysisData.add(data);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisData);
        }
        return retentionAnalysis;
    }

    private Map<String,Object> retentionAnalysisDayDataNum(List<Do_retention_custom_analysis_day> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_day retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisDataNum = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));

            Map<String,Object> dataNum = new HashMap<>();
            dataNum.put("data_date",DateUtil.getPartitionString(retentionCustomAnalysis.getData_date()));
            dataNum.put("user_num",retentionCustomAnalysis.getUser_num());
            dataNum.put("rate_1d",Math.ceil(retentionCustomAnalysis.getRate_1d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_2d",Math.ceil(retentionCustomAnalysis.getRate_2d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_3d",Math.ceil(retentionCustomAnalysis.getRate_3d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_4d",Math.ceil(retentionCustomAnalysis.getRate_4d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_5d",Math.ceil(retentionCustomAnalysis.getRate_5d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_6d",Math.ceil(retentionCustomAnalysis.getRate_6d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_7d",Math.ceil(retentionCustomAnalysis.getRate_7d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_14d",Math.ceil(retentionCustomAnalysis.getRate_14d()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_30d",Math.ceil(retentionCustomAnalysis.getRate_30d()*retentionCustomAnalysis.getUser_num()/100));
            retentionAnalysisDataNum.add(dataNum);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisDataNum);
        }
        return retentionAnalysis;
    }

    private Map<String,Object> retentionAnalysisWeekDataNum(List<Do_retention_custom_analysis_week> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_week retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisDataNum = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));

            Map<String,Object> dataNum = new HashMap<>();
            dataNum.put("data_date",retentionCustomAnalysis.getDate_type());
            dataNum.put("user_num",retentionCustomAnalysis.getUser_num());
            dataNum.put("rate_1w",Math.ceil(retentionCustomAnalysis.getRate_1w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_2w",Math.ceil(retentionCustomAnalysis.getRate_2w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_3w",Math.ceil(retentionCustomAnalysis.getRate_3w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_4w",Math.ceil(retentionCustomAnalysis.getRate_4w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_5w",Math.ceil(retentionCustomAnalysis.getRate_5w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_6w",Math.ceil(retentionCustomAnalysis.getRate_6w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_7w",Math.ceil(retentionCustomAnalysis.getRate_7w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_8w",Math.ceil(retentionCustomAnalysis.getRate_8w()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_9w",Math.ceil(retentionCustomAnalysis.getRate_9w()*retentionCustomAnalysis.getUser_num()/100));
            retentionAnalysisDataNum.add(dataNum);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisDataNum);
        }
        return retentionAnalysis;
    }

    private Map<String,Object> retentionAnalysisMonthDataNum(List<Do_retention_custom_analysis_month> retentionCustomAnalysisList){
        Map<String,Object> retentionAnalysis = new HashMap<>();
        for(Do_retention_custom_analysis_month retentionCustomAnalysis :retentionCustomAnalysisList){
            List retentionAnalysisDataNum = CommonUtil.Object2List(retentionAnalysis.get(retentionCustomAnalysis.getUser_type()));

            Map<String,Object> dataNum = new HashMap<>();
            dataNum.put("data_date",retentionCustomAnalysis.getDate_type());
            dataNum.put("user_num",retentionCustomAnalysis.getUser_num());
            dataNum.put("rate_1m",Math.ceil(retentionCustomAnalysis.getRate_1m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_2m",Math.ceil(retentionCustomAnalysis.getRate_2m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_3m",Math.ceil(retentionCustomAnalysis.getRate_3m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_4m",Math.ceil(retentionCustomAnalysis.getRate_4m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_5m",Math.ceil(retentionCustomAnalysis.getRate_5m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_6m",Math.ceil(retentionCustomAnalysis.getRate_6m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_7m",Math.ceil(retentionCustomAnalysis.getRate_7m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_8m",Math.ceil(retentionCustomAnalysis.getRate_8m()*retentionCustomAnalysis.getUser_num()/100));
            dataNum.put("rate_9m",Math.ceil(retentionCustomAnalysis.getRate_9m()*retentionCustomAnalysis.getUser_num()/100));
            retentionAnalysisDataNum.add(dataNum);

            retentionAnalysis.put(retentionCustomAnalysis.getUser_type(),retentionAnalysisDataNum);
        }
        return retentionAnalysis;
    }

    public DataResult getOperationPayData(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        Float avg_pay_amount = 0.0f;
        Float avg_pay_times = 0.0f;
        Float avg_pay_num = 0.0f;
        Float avg_potential_pay_num = 0.0f;
        List<String> x_axis = new ArrayList<>();
        if(gameCommonStatDayList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(gameCommonStatDayList.get(0).getData_date(), gameCommonStatDayList.get(gameCommonStatDayList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_pay_amount = new HashMap<>();
        Map<String,Object> y_axis_pay_times = new HashMap<>();
        Map<String,Object> y_axis_pay_num = new HashMap<>();
        Map<String,Object> y_axis_potential_pay_num = new HashMap<>();
        Integer i = 1;
        Float sum_pay_amount = 0.0f;
        Float sum_pay_times = 0.0f;
        Float sum_pay_num = 0.0f;
        Float sum_potential_pay_num = 0.0f;
        for(Do_game_common_stat_day gameCommonStatDay:gameCommonStatDayList){
            sum_pay_amount += gameCommonStatDay.getPay_amount();
            sum_pay_times += gameCommonStatDay.getPay_times();
            sum_pay_num += gameCommonStatDay.getPay_num();
            sum_potential_pay_num += gameCommonStatDay.getPotential_pay_num();
            avg_pay_amount += (gameCommonStatDay.getPay_amount() - avg_pay_amount)/i;
            avg_pay_times += (gameCommonStatDay.getPay_times() - avg_pay_times)/i;
            avg_pay_num += (gameCommonStatDay.getPay_num() - avg_pay_num)/i;
            avg_potential_pay_num += (gameCommonStatDay.getPotential_pay_num() - avg_potential_pay_num)/i;
            i++;
            String statDate = DateUtil.getPartitionString(gameCommonStatDay.getData_date());
            y_axis_pay_amount.put(statDate,gameCommonStatDay.getPay_amount());
            y_axis_pay_times.put(statDate,gameCommonStatDay.getPay_times());
            y_axis_pay_num.put(statDate,gameCommonStatDay.getPay_num());
            y_axis_potential_pay_num.put(statDate,gameCommonStatDay.getPotential_pay_num());
        }
        Map<String, Object> axis = new HashMap<>();
        axis.put("x_axis", x_axis);
        axis.put("y_axis_pay_amount", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_amount));
        axis.put("avg_pay_amount", CommonUtil.FloatSet2Scale(avg_pay_amount));
        axis.put("sum_pay_amount", sum_pay_amount);
        axis.put("y_axis_pay_times", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_times));
        axis.put("avg_pay_times", CommonUtil.FloatSet2Scale(avg_pay_times));
        axis.put("sum_pay_times", sum_pay_times);
        axis.put("y_axis_pay_num", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_pay_num));
        axis.put("avg_pay_num", CommonUtil.FloatSet2Scale(avg_pay_num));
        axis.put("sum_pay_num", sum_pay_num);
        axis.put("y_axis_potential_pay_num", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_potential_pay_num));
        axis.put("avg_potential_pay_num", CommonUtil.FloatSet2Scale(avg_potential_pay_num));
        axis.put("sum_potential_pay_num", sum_potential_pay_num);

        List<Do_pay_user_level_distri> payUserLevelDistris = mapperPayUserLevelDistri.getPayUserLevelPaidDistriListByGameId(gameId,startDate,endDate);
        List x_level_axis = new ArrayList<>();
        List y_level_axis_pay_amount = new ArrayList();
        List y_level_axis_pay_times = new ArrayList();
        List y_level_axis_pay_amount_percentage = new ArrayList();
        List y_level_axis_pay_times_percentage = new ArrayList();
        Float sum_level_amount = 0.0f;
        Float sum_level_times = 0.0f;
        for(Do_pay_user_level_distri userLevelDistri : payUserLevelDistris){
            sum_level_amount += userLevelDistri.getPay_amount();
            sum_level_times += userLevelDistri.getPay_times();
        }
        for(Do_pay_user_level_distri userLevelDistri : payUserLevelDistris){
            x_level_axis.add(userLevelDistri.getLevel());
            y_level_axis_pay_amount.add(CommonUtil.FloatSet2Scale(userLevelDistri.getPay_amount()));
            y_level_axis_pay_times.add(userLevelDistri.getPay_times());
            y_level_axis_pay_amount_percentage.add(calculateUserRate(userLevelDistri.getPay_amount(),sum_level_amount));
            y_level_axis_pay_times_percentage.add(calculateUserRate((float)userLevelDistri.getPay_times(),sum_level_times));
        }
        Map<String,Object> axis_level = new HashMap<>();
        axis_level.put("x_level_axis", x_level_axis);
        axis_level.put("y_level_axis_pay_amount", y_level_axis_pay_amount);
        axis_level.put("y_level_axis_pay_times", y_level_axis_pay_times);
        axis_level.put("y_level_axis_pay_amount_percentage", y_level_axis_pay_amount_percentage);
        axis_level.put("y_level_axis_pay_times_percentage", y_level_axis_pay_times_percentage);

        List<Do_pay_user_area_distri> payUserAreaDistris = mapperPayUserAreaDistri.getPayUserAreaPaidDistriListByGameId(gameId,startDate,endDate);
        Collections.sort(payUserAreaDistris, new Comparator<Do_pay_user_area_distri>() {
            @Override
            public int compare(Do_pay_user_area_distri o1, Do_pay_user_area_distri o2) {
                return -o1.getPay_amount().compareTo(o2.getPay_amount());
            }
        });
        Map<String,Object> payUserArea  = new HashMap<>();
        Map<String,Float> areaSumMap = new HashMap<>();
        for(Do_pay_user_area_distri payUserAreaDistri : payUserAreaDistris){
            Float areaSum = 0.0f;
            if(null != areaSumMap.get(payUserAreaDistri.getUser_type())){
                areaSum = areaSumMap.get(payUserAreaDistri.getUser_type());
                areaSum += payUserAreaDistri.getUser_num();
            }
            areaSumMap.put(payUserAreaDistri.getUser_type(),areaSum);
        }
        for(Do_pay_user_area_distri payUserAreaDistri : payUserAreaDistris){
            payUserAreaDistri.setPercentage(calculateUserRate(payUserAreaDistri.getUser_num(),areaSumMap.get(payUserAreaDistri.getUser_type())));
            payUserArea = separateAreaDistri(payUserAreaDistri,payUserArea);
        }

        List<Do_channel_common_stat> channelCommonStats = mapperChannelCommonStat.getChannelPayByGameId(gameId,startDate,endDate);
        List<String> x_channel_axis = new ArrayList<>();
        List y_channel_axis_pay_amount = new ArrayList<>();
        List y_channel_axis_pay_amount_percentage = new ArrayList<>();
        Float sum_channel_pay_amount = 0.0f;
        for(Do_channel_common_stat channelCommonStat:channelCommonStats){
            sum_channel_pay_amount += channelCommonStat.getPay_amount();
        }
        for(Do_channel_common_stat channelCommonStat:channelCommonStats){
            x_channel_axis.add(channelCommonStat.getChannel_id());
            y_channel_axis_pay_amount_percentage.add(calculateUserRate(channelCommonStat.getPay_amount(),sum_channel_pay_amount));
            y_channel_axis_pay_amount.add(channelCommonStat.getPay_amount());
        }
        Map<String,Object> axis_channel = new HashMap<>();
        axis_channel.put("x_channel_axis", x_channel_axis);
        axis_channel.put("y_channel_axis_pay_amount", y_channel_axis_pay_amount);
        axis_channel.put("y_channel_axis_pay_amount_percentage", y_channel_axis_pay_amount_percentage);

        Map<String, Object> result = new HashMap<>();
        result.put("pay_data",axis);
        result.put("pay_level",axis_level);
        result.put("axis_area",payUserArea);
        result.put("axis_channel",axis_channel);

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationPayRateData(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);
        List<Do_pay_common_stat_week> payCommonStatWeekList = mapperPayCommonStat.getPayCommonStatWeekListByGameId(gameId,startDate,endDate);
        List<Do_pay_common_stat_month> payCommonStatMonthList = mapperPayCommonStat.getPayCommonStatMonthListByGameId(gameId,startDate,endDate);

        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        Float avg_pay_rate_day = 0.0f;
        Float avg_pay_rate_week = 0.0f;
        Float avg_pay_rate_month = 0.0f;
        List x_axis_pay_rate_day = new ArrayList<>();
        List y_axis_pay_rate_day = new ArrayList<>();
        List x_axis_pay_rate_week = new ArrayList<>();
        List y_axis_pay_rate_week = new ArrayList<>();
        List x_axis_pay_rate_month = new ArrayList<>();
        List y_axis_pay_rate_month = new ArrayList<>();

        Float avg_arpu_day = 0.0f;
        Float avg_arpu_month = 0.0f;
        Float avg_arppu_day = 0.0f;
        Float avg_arppu_month = 0.0f;
        List x_axis_arpu_day = new ArrayList<>();
        List y_axis_arpu_day = new ArrayList<>();
        List x_axis_arpu_month = new ArrayList<>();
        List y_axis_arpu_month = new ArrayList<>();
        List x_axis_arppu_day = new ArrayList<>();
        List y_axis_arppu_day = new ArrayList<>();
        List x_axis_arppu_month = new ArrayList<>();
        List y_axis_arppu_month = new ArrayList<>();

        Integer i = 1;
        for(Do_game_common_stat_day gameCommonStatDay:gameCommonStatDayList){
            avg_pay_rate_day += (gameCommonStatDay.getPay_rate() - avg_pay_rate_day)/i;
            x_axis_pay_rate_day.add(DateUtil.getPartitionString(gameCommonStatDay.getData_date()));
            y_axis_pay_rate_day.add(gameCommonStatDay.getPay_rate());

            avg_arpu_day += (gameCommonStatDay.getArpu() - avg_arpu_day)/i;
            avg_arppu_day += (gameCommonStatDay.getArppu() - avg_arppu_day)/i;

            x_axis_arpu_day.add(DateUtil.getPartitionString(gameCommonStatDay.getData_date()));
            x_axis_arppu_day.add(DateUtil.getPartitionString(gameCommonStatDay.getData_date()));
            y_axis_arpu_day.add(gameCommonStatDay.getArpu());
            y_axis_arppu_day.add(gameCommonStatDay.getArppu());

            i++;
        }
        i = 1;
        for(Do_pay_common_stat_week payCommonStatWeek:payCommonStatWeekList){
            avg_pay_rate_week += (payCommonStatWeek.getPay_rate() - avg_pay_rate_week)/i;
            i++;
            x_axis_pay_rate_week.add(DateUtil.getPartitionString(payCommonStatWeek.getData_date()));
            y_axis_pay_rate_week.add(payCommonStatWeek.getPay_rate());
        }
        i = 1;
        for(Do_pay_common_stat_month payCommonStatMonth:payCommonStatMonthList){
            avg_pay_rate_month += (payCommonStatMonth.getPay_rate() - avg_pay_rate_month)/i;

            x_axis_pay_rate_month.add(DateUtil.getPartitionString(payCommonStatMonth.getData_date()));
            y_axis_pay_rate_month.add(payCommonStatMonth.getPay_rate());

            avg_arpu_month += (payCommonStatMonth.getArpu() - avg_arpu_month)/i;
            avg_arppu_month += (payCommonStatMonth.getArppu() - avg_arppu_month)/i;

            x_axis_arpu_month.add(DateUtil.getPartitionString(payCommonStatMonth.getData_date()));
            x_axis_arppu_month.add(DateUtil.getPartitionString(payCommonStatMonth.getData_date()));
            y_axis_arpu_month.add(payCommonStatMonth.getArpu());
            y_axis_arppu_month.add(payCommonStatMonth.getArppu());

            i++;
        }
        Map<String, Object> axis_pay_rate = new HashMap<>();
        axis_pay_rate.put("x_axis_pay_rate_day", x_axis_pay_rate_day);
        axis_pay_rate.put("y_axis_pay_rate_day", y_axis_pay_rate_day);
        axis_pay_rate.put("avg_pay_rate_day", CommonUtil.FloatSet2Scale(avg_pay_rate_day));
        axis_pay_rate.put("x_axis_pay_rate_week", x_axis_pay_rate_week);
        axis_pay_rate.put("y_axis_pay_rate_week", y_axis_pay_rate_week);
        axis_pay_rate.put("avg_pay_rate_week", CommonUtil.FloatSet2Scale(avg_pay_rate_week));
        axis_pay_rate.put("x_axis_pay_rate_month", x_axis_pay_rate_month);
        axis_pay_rate.put("y_axis_pay_rate_month", y_axis_pay_rate_month);
        axis_pay_rate.put("avg_pay_rate_month", CommonUtil.FloatSet2Scale(avg_pay_rate_month));

        Map<String, Object> axis_arpu = new HashMap<>();
        axis_arpu.put("x_axis_arpu_day", x_axis_arpu_day);
        axis_arpu.put("y_axis_arpu_day", y_axis_arpu_day);
        axis_arpu.put("avg_arpu_day", CommonUtil.FloatSet2Scale(avg_arpu_day));
        axis_arpu.put("x_axis_arppu_day", x_axis_arppu_day);
        axis_arpu.put("y_axis_arppu_day", y_axis_arppu_day);
        axis_arpu.put("avg_arppu_day", CommonUtil.FloatSet2Scale(avg_arppu_day));
        axis_arpu.put("x_axis_arpu_month", x_axis_arpu_month);
        axis_arpu.put("y_axis_arpu_month", y_axis_arpu_month);
        axis_arpu.put("avg_arpu_month", CommonUtil.FloatSet2Scale(avg_arpu_month));
        axis_arpu.put("x_axis_arppu_month", x_axis_arppu_month);
        axis_arpu.put("y_axis_arppu_month", y_axis_arppu_month);
        axis_arpu.put("avg_arppu_month", CommonUtil.FloatSet2Scale(avg_arppu_month));

        List<Do_pay_user_area_distri> payUserAreaDistris = mapperPayUserAreaDistri.getPayUserAreaPaidDistriListByGameId(gameId,startDate,endDate);
        Map<String,Object> payUserArea  = new HashMap<>();
        for(Do_pay_user_area_distri payUserAreaDistri : payUserAreaDistris){
            payUserArea = separateAreaDistri(payUserAreaDistri,payUserArea);
        }

        List<Do_channel_common_stat> channelCommonStats = mapperChannelCommonStat.getChannelPayByGameId(gameId,startDate,endDate);
        List x_channe_axis = new ArrayList<>();
        List y_channe_axis_pay_rate = new ArrayList<>();
        List y_channe_axis_arpu = new ArrayList<>();
        List y_channe_axis_arppu = new ArrayList<>();
        for(Do_channel_common_stat channelCommonStat:channelCommonStats){
            x_channe_axis.add(channelCommonStat.getChannel_id());
            y_channe_axis_pay_rate.add(channelCommonStat.getPay_rate());
            y_channe_axis_arpu.add(CommonUtil.FloatSet2Scale(channelCommonStat.getArpu()));
            y_channe_axis_arppu.add(CommonUtil.FloatSet2Scale(channelCommonStat.getArppu()));
        }
        Map<String,Object> axis_channel = new HashMap<>();
        axis_channel.put("x_channe_axis", x_channe_axis);
        axis_channel.put("y_channe_axis_pay_rate", y_channe_axis_pay_rate);
        axis_channel.put("y_channe_axis_arpu", y_channe_axis_arpu);
        axis_channel.put("y_channe_axis_arppu", y_channe_axis_arppu);

        Map<String, Object> result = new HashMap<>();
        result.put("axis_pay_rate",axis_pay_rate);
        result.put("axis_arpu",axis_arpu);
        result.put("axis_area",payUserArea);
        result.put("axis_channel",axis_channel);

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationFirstPay(Integer gameId, String startDate, String endDate) {
        List<Do_game_common_stat_day> gameCommonStatDayList = mapperGameCommonStatDay.getGameCommonStatDayListByGameIdAndDate(gameId, startDate, endDate);

        Collections.sort(gameCommonStatDayList, new Comparator<Do_game_common_stat_day>(){
            @Override
            public int compare(Do_game_common_stat_day o1, Do_game_common_stat_day o2) {
                return o1.getData_date().compareTo(o2.getData_date());
            }
        });
        Float avg_first_pay_rate_day = 0.0f;
        Float avg_first_pay_rate_week = 0.0f;
        Float avg_first_pay_rate_month = 0.0f;
        List x_axis_first_pay_rate = new ArrayList<>();
        List y_axis_first_pay_rate_day = new ArrayList<>();
        List y_axis_first_pay_rate_week = new ArrayList<>();
        List y_axis_first_pay_rate_month = new ArrayList<>();

        Integer i = 1;
        for (Do_game_common_stat_day gameCommonStat:gameCommonStatDayList){
            avg_first_pay_rate_day += (gameCommonStat.getFirst_day_pay_rate() - avg_first_pay_rate_day)/i;
            avg_first_pay_rate_week += (gameCommonStat.getFirst_week_pay_rate() - avg_first_pay_rate_week)/i;
            avg_first_pay_rate_month += (gameCommonStat.getFirst_month_pay_rate() - avg_first_pay_rate_month)/i;


            if(!x_axis_first_pay_rate.contains(DateUtil.getPartitionString(gameCommonStat.getData_date()))){
                x_axis_first_pay_rate.add(DateUtil.getPartitionString(gameCommonStat.getData_date()));
            }
            y_axis_first_pay_rate_day.add(gameCommonStat.getFirst_day_pay_rate());
            y_axis_first_pay_rate_week.add(gameCommonStat.getFirst_week_pay_rate());
            y_axis_first_pay_rate_month.add(gameCommonStat.getFirst_month_pay_rate());

            i++;
        }
        Map<String,Object> axis_first_pay_rate = new HashMap<>();
        axis_first_pay_rate.put("avg_first_pay_rate_day", CommonUtil.FloatSet2Scale(avg_first_pay_rate_day));
        axis_first_pay_rate.put("avg_first_pay_rate_week", CommonUtil.FloatSet2Scale(avg_first_pay_rate_week));
        axis_first_pay_rate.put("avg_first_pay_rate_month", CommonUtil.FloatSet2Scale(avg_first_pay_rate_month));
        axis_first_pay_rate.put("x_axis_first_pay_rate", x_axis_first_pay_rate);
        axis_first_pay_rate.put("y_axis_first_pay_rate_day", y_axis_first_pay_rate_day);
        axis_first_pay_rate.put("y_axis_first_pay_rate_week", y_axis_first_pay_rate_week);
        axis_first_pay_rate.put("y_axis_first_pay_rate_month", y_axis_first_pay_rate_month);

        List<Do_first_pay_user_oldays_distri> firstPayUserOldaysDistriList = mapperFirstPayUserOldaysDistri.getFirstPayUserOldaysListByGameIdAndDate(gameId,startDate,endDate);
        List<Do_first_pay_user_total_oltime_distri> firstPayUserTotalOltimeDistriList = mapperFirstPayUserTotalOltimeDistri.getFirstPayUserTotalOltimeListByGameIdAndDate(gameId,startDate,endDate);

        List x_axis_first_pay_oldays = new ArrayList<>();
        List y_axis_first_pay_oldays = new ArrayList<>();
        for(Do_first_pay_user_oldays_distri firstPayUserOldaysDistri:firstPayUserOldaysDistriList){
            x_axis_first_pay_oldays.add(firstPayUserOldaysDistri.getOldays_classify());
            y_axis_first_pay_oldays.add(firstPayUserOldaysDistri.getUser_num());
        }
        List x_axis_first_pay_total_oltime = new ArrayList<>();
        List y_axis_first_pay_total_oltime = new ArrayList<>();
        for(Do_first_pay_user_total_oltime_distri firstPayUserTotalOltimeDistri:firstPayUserTotalOltimeDistriList){
            x_axis_first_pay_total_oltime.add(firstPayUserTotalOltimeDistri.getTotal_oltime_classify());
            y_axis_first_pay_total_oltime.add(firstPayUserTotalOltimeDistri.getUser_num());
        }
        Map<String,Object> axis_first_pay_total_oltime = new HashMap<>();
        axis_first_pay_total_oltime.put("x_axis_first_pay_oldays", x_axis_first_pay_oldays);
        axis_first_pay_total_oltime.put("y_axis_first_pay_oldays", y_axis_first_pay_oldays);
        axis_first_pay_total_oltime.put("x_axis_first_pay_total_oltime", x_axis_first_pay_total_oltime);
        axis_first_pay_total_oltime.put("y_axis_first_pay_total_oltime", y_axis_first_pay_total_oltime);

        List<Do_first_pay_user_level_distri> firstPayUserLevelDistriList = mapperFirstPayUserLevelDistri.getFirstPayUserLevelListByGameIdAndDate(gameId,startDate,endDate);
        List x_axis_first_pay_level = new ArrayList<>();
        List y_axis_first_pay_level = new ArrayList<>();
        for(Do_first_pay_user_level_distri firstPayUserLevelDistri:firstPayUserLevelDistriList){
            x_axis_first_pay_level.add(firstPayUserLevelDistri.getLevel());
            y_axis_first_pay_level.add(firstPayUserLevelDistri.getUser_num());
        }
        Map<String,Object> axis_first_pay_level = new HashMap<>();
        axis_first_pay_level.put("x_axis_first_pay_level", x_axis_first_pay_level);
        axis_first_pay_level.put("y_axis_first_pay_level", y_axis_first_pay_level);

        List<Do_first_pay_user_amount_distri> firstPayUserAmountDistriList = mapperFirstPayUserAmountDistri.getFirstPayUserAmountListByGameIdAndDate(gameId,startDate,endDate);
        List x_axis_first_pay_amount = new ArrayList<>();
        List y_axis_first_pay_amount = new ArrayList<>();
        for(Do_first_pay_user_amount_distri firstPayUserAmountDistri:firstPayUserAmountDistriList){
            x_axis_first_pay_amount.add(firstPayUserAmountDistri.getAmount_classify());
            y_axis_first_pay_amount.add(firstPayUserAmountDistri.getUser_num());
        }
        Map<String,Object> axis_first_pay_amount = new HashMap<>();
        axis_first_pay_amount.put("x_axis_first_pay_amount", x_axis_first_pay_amount);
        axis_first_pay_amount.put("y_axis_first_pay_amount", y_axis_first_pay_amount);

        List<Do_first_pay_user_item_distri> firstPayUserItemDistriList = mapperFirstPayUserItemDistri.getFirstPayUserItemListByGameIdAndDate(gameId,startDate,endDate);
        List x_axis_first_pay_item = new ArrayList<>();
        List y_axis_first_pay_item = new ArrayList<>();
        for(Do_first_pay_user_item_distri firstPayUserItemDistri:firstPayUserItemDistriList){
            x_axis_first_pay_item.add(firstPayUserItemDistri.getItem());
            y_axis_first_pay_item.add(firstPayUserItemDistri.getUser_num());
        }
        Map<String,Object> axis_first_pay_item = new HashMap<>();
        axis_first_pay_item.put("x_axis_first_pay_item", x_axis_first_pay_item);
        axis_first_pay_item.put("y_axis_first_pay_item", y_axis_first_pay_item);


        Map<String, Object> result = new HashMap<>();
        result.put("axis_first_pay_rate",axis_first_pay_rate);
        result.put("axis_first_pay_total_oltime",axis_first_pay_total_oltime);
        result.put("axis_first_pay_level",axis_first_pay_level);
        result.put("axis_first_pay_amount",axis_first_pay_amount);
        result.put("axis_first_pay_item",axis_first_pay_item);

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationPayHabit(Integer gameId, String startDate, String endDate) {

        List<Do_pay_user_paytimes_distri> payUserPaytimesWeekDistris = mapperPayUserPaytimesDistri.getPayUserPaytimesWeekListByGameIdAndDate(gameId,startDate,endDate);
        List<Do_pay_user_paytimes_distri> payUserPaytimesMonthDistris = mapperPayUserPaytimesDistri.getPayUserPaytimesMonthListByGameIdAndDate(gameId,startDate,endDate);
        List<Do_pay_user_payamount_distri> payUserPayamountWeekDistris = mapperPayUserPayamountDistri.getPayUserPayamountWeekListByGameIdAndDate(gameId,startDate,endDate);
        List<Do_pay_user_payamount_distri> payUserPayamountMonthDistris = mapperPayUserPayamountDistri.getPayUserPayamountMonthListByGameIdAndDate(gameId,startDate,endDate);

        List x_axis_paytimes_week = new ArrayList<>();
        List y_axis_paytimes_week = new ArrayList<>();
        List y_axis_paytimes_week_percentage = new ArrayList<>();
        List x_axis_paytimes_month = new ArrayList<>();
        List y_axis_paytimes_month = new ArrayList<>();
        List y_axis_paytimes_month_percentage = new ArrayList<>();
        List x_axis_payamount_week = new ArrayList<>();
        List y_axis_payamount_week = new ArrayList<>();
        List y_axis_payamount_week_percentage = new ArrayList<>();
        List x_axis_payamount_month = new ArrayList<>();
        List y_axis_payamount_month = new ArrayList<>();
        List y_axis_payamount_month_percentage = new ArrayList<>();

        Float sum_pay = 0.0f;

        for(Do_pay_user_paytimes_distri payUserPaytimesDistri:payUserPaytimesWeekDistris){
            sum_pay += payUserPaytimesDistri.getUser_num();
        }
        for(Do_pay_user_paytimes_distri payUserPaytimesDistri:payUserPaytimesWeekDistris){
            x_axis_paytimes_week.add(payUserPaytimesDistri.getPaytimes_classify());
            y_axis_paytimes_week.add(payUserPaytimesDistri.getUser_num());
            y_axis_paytimes_week_percentage.add(calculateUserRate(payUserPaytimesDistri.getUser_num(),sum_pay));
        }
        sum_pay = 0.0f;
        for(Do_pay_user_paytimes_distri payUserPaytimesDistri:payUserPaytimesMonthDistris){
            sum_pay += payUserPaytimesDistri.getUser_num();
        }
        for(Do_pay_user_paytimes_distri payUserPaytimesDistri:payUserPaytimesMonthDistris){
            x_axis_paytimes_month.add(payUserPaytimesDistri.getPaytimes_classify());
            y_axis_paytimes_month.add(payUserPaytimesDistri.getUser_num());
            y_axis_paytimes_month_percentage.add(calculateUserRate(payUserPaytimesDistri.getUser_num(),sum_pay));
        }
        sum_pay = 0.0f;
        for(Do_pay_user_payamount_distri payUserPayamountDistri:payUserPayamountWeekDistris){
            sum_pay += payUserPayamountDistri.getUser_num();
        }
        for(Do_pay_user_payamount_distri payUserPayamountDistri:payUserPayamountWeekDistris){
            x_axis_payamount_week.add(payUserPayamountDistri.getPayamount_classify());
            y_axis_payamount_week.add(payUserPayamountDistri.getUser_num());
            y_axis_payamount_week_percentage.add(calculateUserRate(payUserPayamountDistri.getUser_num(),sum_pay));
        }
        sum_pay = 0.0f;
        for(Do_pay_user_payamount_distri payUserPayamountDistri:payUserPayamountMonthDistris){
            sum_pay += payUserPayamountDistri.getUser_num();
        }
        for(Do_pay_user_payamount_distri payUserPayamountDistri:payUserPayamountMonthDistris){
            x_axis_payamount_month.add(payUserPayamountDistri.getPayamount_classify());
            y_axis_payamount_month.add(payUserPayamountDistri.getUser_num());
            y_axis_payamount_month_percentage.add(calculateUserRate(payUserPayamountDistri.getUser_num(),sum_pay));
        }
        Map<String,Object> axis_pay = new HashMap<>();
        axis_pay.put("x_axis_paytimes_week", x_axis_paytimes_week);
        axis_pay.put("y_axis_paytimes_week", y_axis_paytimes_week);
        axis_pay.put("y_axis_paytimes_week_percentage", y_axis_paytimes_week_percentage);
        axis_pay.put("x_axis_paytimes_month", x_axis_paytimes_month);
        axis_pay.put("y_axis_paytimes_month", y_axis_paytimes_month);
        axis_pay.put("y_axis_paytimes_month_percentage", y_axis_paytimes_month_percentage);
        axis_pay.put("x_axis_payamount_week", x_axis_payamount_week);
        axis_pay.put("y_axis_payamount_week", y_axis_payamount_week);
        axis_pay.put("y_axis_payamount_week_percentage", y_axis_payamount_week_percentage);
        axis_pay.put("x_axis_payamount_month", x_axis_payamount_month);
        axis_pay.put("y_axis_payamount_month", y_axis_payamount_month);
        axis_pay.put("y_axis_payamount_month_percentage", y_axis_payamount_month_percentage);

        List<Do_first_pay_user_time_elapse_distri> userTimeElapseDistriList = mapperFirstPayUserTimeElapseDistri.getFirstPayUserTimeElapseListByGameIdAndDate(gameId,startDate,endDate);
        List x_axis_time_elapse = new ArrayList<>();
        List y_axis_time_elapse = new ArrayList<>();
        List y_axis_time_elapse_percentage = new ArrayList<>();
        sum_pay = 0.0f;
        for(Do_first_pay_user_time_elapse_distri payUserTimeElapseDistri:userTimeElapseDistriList){
            sum_pay += payUserTimeElapseDistri.getUser_num();
        }
        for(Do_first_pay_user_time_elapse_distri payUserTimeElapseDistri:userTimeElapseDistriList){
            x_axis_time_elapse.add(payUserTimeElapseDistri.getElapse_time_classify());
            y_axis_time_elapse.add(payUserTimeElapseDistri.getUser_num());
            y_axis_time_elapse_percentage.add(CommonUtil.FloatSet2Scale(calculateUserRate(payUserTimeElapseDistri.getUser_num(),sum_pay)));
        }
        Map<String,Object> axis_time_elapse = new HashMap<>();
        axis_time_elapse.put("x_axis_time_elapse", x_axis_time_elapse);
        axis_time_elapse.put("y_axis_time_elapse", y_axis_time_elapse);
        axis_time_elapse.put("y_axis_time_elapse_percentage", y_axis_time_elapse_percentage);

        List<Do_pay_user_pay_method_distri> userPayMethodDistriList = mapperPayUserPayMethodDistri.getPayUserPayMethodListByGameIdAndDate(gameId,startDate,endDate);;
        List x_axis_pay_method = new ArrayList<>();
        List y_axis_pay_amount = new ArrayList<>();
        List y_axis_pay_amount_percentage = new ArrayList<>();
        List y_axis_pay_times = new ArrayList<>();
        List y_axis_pay_times_percentage = new ArrayList<>();
        Float sum_times = 0.0f;
        sum_pay = 0.0f;
        for(Do_pay_user_pay_method_distri payUserPayMethodDistri:userPayMethodDistriList){
            sum_pay += payUserPayMethodDistri.getPay_amount();
            sum_times += payUserPayMethodDistri.getPay_times();
        }
        for(Do_pay_user_pay_method_distri payUserPayMethodDistri:userPayMethodDistriList){
            x_axis_pay_method.add(payUserPayMethodDistri.getPay_method());
            y_axis_pay_amount.add(payUserPayMethodDistri.getPay_amount());
            y_axis_pay_amount_percentage.add(CommonUtil.FloatSet2Scale(calculateUserRate(payUserPayMethodDistri.getPay_amount(),sum_pay)));
            y_axis_pay_times.add(payUserPayMethodDistri.getPay_times());
            y_axis_pay_times_percentage.add(CommonUtil.FloatSet2Scale(calculateUserRate((float) payUserPayMethodDistri.getPay_times(),sum_times)));
        }
        Map<String,Object> axis_pay_method = new HashMap<>();
        axis_pay_method.put("x_axis_pay_method", x_axis_pay_method);
        axis_pay_method.put("y_axis_pay_amount", y_axis_pay_amount);
        axis_pay_method.put("y_axis_pay_amount_percentage", y_axis_pay_amount_percentage);
        axis_pay_method.put("y_axis_pay_times", y_axis_pay_times);
        axis_pay_method.put("y_axis_pay_times_percentage", y_axis_pay_times_percentage);

        List<Do_pay_user_pay_item_distri> userPayItemDistriList = mapperPayUserPayItemDistri.getPayUserPayItemListByGameIdAndDate(gameId,startDate,endDate);;
        List x_axis_pay_item = new ArrayList<>();
        List y_axis_pay_item_amount = new ArrayList<>();
        List y_axis_pay_item_amount_percentage = new ArrayList<>();
        List y_axis_pay_item_times = new ArrayList<>();
        List y_axis_pay_item_times_percentage = new ArrayList<>();
        sum_pay = 0.0f;
        sum_times = 0.0f;
        for(Do_pay_user_pay_item_distri payUserPayItemDistri:userPayItemDistriList){
            sum_pay += payUserPayItemDistri.getPay_amount();
            sum_times += payUserPayItemDistri.getPay_times();
        }
        for(Do_pay_user_pay_item_distri payUserPayItemDistri:userPayItemDistriList){
            x_axis_pay_item.add(payUserPayItemDistri.getPay_item());
            y_axis_pay_item_amount.add(payUserPayItemDistri.getPay_amount());
            y_axis_pay_item_amount_percentage.add(CommonUtil.FloatSet2Scale(calculateUserRate(payUserPayItemDistri.getPay_amount(),sum_pay)));
            y_axis_pay_item_times.add(payUserPayItemDistri.getPay_times());
            y_axis_pay_item_times_percentage.add(CommonUtil.FloatSet2Scale(calculateUserRate((float)payUserPayItemDistri.getPay_times(),sum_times)));
        }
        Map<String,Object> axis_pay_item = new HashMap<>();
        axis_pay_item.put("x_axis_pay_item", x_axis_pay_item);
        axis_pay_item.put("y_axis_pay_item_amount", y_axis_pay_item_amount);
        axis_pay_item.put("y_axis_pay_item_amount_percentage", y_axis_pay_item_amount_percentage);
        axis_pay_item.put("y_axis_pay_item_times", y_axis_pay_item_times);
        axis_pay_item.put("y_axis_pay_item_times_percentage", y_axis_pay_item_times_percentage);

        Map<String, Object> result = new HashMap<>();
        result.put("axis_pay",axis_pay);
        result.put("axis_time_elapse",axis_time_elapse);
        result.put("axis_pay_method",axis_pay_method);
        result.put("axis_pay_item",axis_pay_item);

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationLostCount(Integer gameId, String startDate, String endDate) {
        List<Do_lost_common_stat> lostCommonStatList = mapperLostCommonStat.getLostCommonStatListByGameId(gameId,startDate,endDate);
        List<String> x_axis = new ArrayList<>();
        if(lostCommonStatList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(lostCommonStatList.get(0).getData_date(), lostCommonStatList.get(lostCommonStatList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_active_lost_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_active_lost_rate_14d = new HashMap<>();
        Map<String,Object> y_axis_active_lost_rate_30d = new HashMap<>();
        Map<String,Object> y_axis_active_back_num_7d = new HashMap<>();
        Map<String,Object> y_axis_active_back_num_14d = new HashMap<>();
        Map<String,Object> y_axis_active_back_num_30d = new HashMap<>();
        Map<String,Object> y_axis_paid_lost_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_paid_lost_rate_14d = new HashMap<>();
        Map<String,Object> y_axis_paid_lost_rate_30d = new HashMap<>();
        Map<String,Object> y_axis_paid_back_num_7d = new HashMap<>();
        Map<String,Object> y_axis_paid_back_num_14d = new HashMap<>();
        Map<String,Object> y_axis_paid_back_num_30d = new HashMap<>();
        for(Do_lost_common_stat lostCommonStat:lostCommonStatList){
            String statDate = DateUtil.getPartitionString(lostCommonStat.getData_date());
            if("active".equals(lostCommonStat.getUser_type())){
                y_axis_active_lost_rate_7d.put(statDate,lostCommonStat.getLost_rate_7d());
                y_axis_active_lost_rate_14d.put(statDate,lostCommonStat.getLost_rate_14d());
                y_axis_active_lost_rate_30d.put(statDate,lostCommonStat.getLost_rate_30d());
                y_axis_active_back_num_7d.put(statDate,lostCommonStat.getBack_num_7d());
                y_axis_active_back_num_14d.put(statDate,lostCommonStat.getBack_num_14d());
                y_axis_active_back_num_30d.put(statDate,lostCommonStat.getBack_num_30d());
            }else {
                y_axis_paid_lost_rate_7d.put(statDate,lostCommonStat.getLost_rate_7d());
                y_axis_paid_lost_rate_14d.put(statDate,lostCommonStat.getLost_rate_14d());
                y_axis_paid_lost_rate_30d.put(statDate,lostCommonStat.getLost_rate_30d());
                y_axis_paid_back_num_7d.put(statDate,lostCommonStat.getBack_num_7d());
                y_axis_paid_back_num_14d.put(statDate,lostCommonStat.getBack_num_14d());
                y_axis_paid_back_num_30d.put(statDate,lostCommonStat.getBack_num_30d());
            }
        }
        Map<String,Object> axis_lost = new HashMap<>();
        axis_lost.put("x_axis", x_axis);
        axis_lost.put("y_axis_active_lost_rate_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_lost_rate_7d));
        axis_lost.put("y_axis_active_lost_rate_14d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_lost_rate_14d));
        axis_lost.put("y_axis_active_lost_rate_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_lost_rate_30d));
        axis_lost.put("y_axis_paid_lost_rate_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_lost_rate_7d));
        axis_lost.put("y_axis_paid_lost_rate_14d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_lost_rate_14d));
        axis_lost.put("y_axis_paid_lost_rate_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_lost_rate_30d));
        Map<String,Object> axis_back = new HashMap<>();
        axis_back.put("x_axis", x_axis);
        axis_back.put("y_axis_active_back_num_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_back_num_7d));
        axis_back.put("y_axis_active_back_num_14d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_back_num_14d));
        axis_back.put("y_axis_active_back_num_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_active_back_num_30d));
        axis_back.put("y_axis_paid_back_num_7d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_back_num_7d));
        axis_back.put("y_axis_paid_back_num_14d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_back_num_14d));
        axis_back.put("y_axis_paid_back_num_30d", CommonUtil.getXAxisDataWithYAxisMap(x_axis,y_axis_paid_back_num_30d));

        Map<String, Object> result = new HashMap<>();
        result.put("axis_lost",axis_lost);
        result.put("axis_back",axis_back);
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationLostFunnel(Integer gameId, String dataDate) {
        List<Do_lost_funnel_stat> lostFunnelStatList = mapperLostFunnelStat.getLostFunnelStatListByGameId(gameId,dataDate);
        Map<String,Object> result = new HashMap<>();

        for(Do_lost_funnel_stat lostFunnelStat:lostFunnelStatList){
            List x_axis = new ArrayList<>();
            List user_num = new ArrayList();
            List user_rate = new ArrayList();
            List user_rate_span = new ArrayList();
            if("new".equals(lostFunnelStat.getUser_type())){
                x_axis.add("新增用户");
            }else if("active".equals(lostFunnelStat.getUser_type())){
                x_axis.add("活跃玩家");
            }else {
                x_axis.add("付费玩家");
            }

            x_axis.add("+1日");
            x_axis.add("+2日");
            x_axis.add("+7日");
            x_axis.add("+1周");
            x_axis.add("+3周");
            x_axis.add("+7周");
            x_axis.add("+1年");
            user_num.add(lostFunnelStat.getTotal_user_num());
            user_num.add(lostFunnelStat.getLeft_user_1d());
            user_num.add(lostFunnelStat.getLeft_user_2d());
            user_num.add(lostFunnelStat.getLeft_user_7d());
            user_num.add(lostFunnelStat.getLeft_user_2w());
            user_num.add(lostFunnelStat.getLeft_user_3w());
            user_num.add(lostFunnelStat.getLeft_user_6w());
            user_num.add(lostFunnelStat.getLeft_user_1y());

            user_rate.add(100);
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_1d(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_2d(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_7d(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_2w(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_3w(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_6w(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate.add(calculateUserRate((float)lostFunnelStat.getLeft_user_1y(),(float)lostFunnelStat.getTotal_user_num()));

            user_rate_span.add(calculateUserRate((float)lostFunnelStat.getLeft_user_1d(),(float)lostFunnelStat.getTotal_user_num()));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_2d(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_1d(),(float)lostFunnelStat.getTotal_user_num())));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_7d(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_2d(),(float)lostFunnelStat.getTotal_user_num())));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_2w(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_7d(),(float)lostFunnelStat.getTotal_user_num())));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_3w(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_2w(),(float)lostFunnelStat.getTotal_user_num())));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_6w(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_3w(),(float)lostFunnelStat.getTotal_user_num())));
            user_rate_span.add(calculateUserRate(calculateUserRate((float)lostFunnelStat.getLeft_user_1y(),(float)lostFunnelStat.getTotal_user_num()),calculateUserRate((float)lostFunnelStat.getLeft_user_6w(),(float)lostFunnelStat.getTotal_user_num())));


            Map<String,Object> axis_lost_funnel = new HashMap<>();
            axis_lost_funnel.put("x_axis",x_axis);
            axis_lost_funnel.put("y_user_num",user_num);
            axis_lost_funnel.put("y_user_rate",user_rate);
            axis_lost_funnel.put("user_rate_span",user_rate_span);
            result.put(lostFunnelStat.getUser_type(),axis_lost_funnel);
        }

        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public DataResult getOperationChannelQuality(Integer gameId, String startDate, String endDate) {
        List<Do_channel_common_stat> channelQualityList = mapperChannelCommonStat.getChannelQualityByGameId(gameId,startDate,endDate);
        List<Map<String,Object>> channelQualityMapList = new ArrayList();
        Float sumNewloginNum = 0.0f;

        for(Do_channel_common_stat channelCommonStat:channelQualityList){
            Map<String,Object> channelQuality = new HashMap<>();
            channelQuality.put("channel_id",channelCommonStat.getChannel_id());
            channelQuality.put("newlogin_num",channelCommonStat.getNewlogin_num());
            channelQuality.put("retention_rate_1d",channelCommonStat.getRetention_rate_1d());
            channelQuality.put("retention_rate_7d",channelCommonStat.getRetention_rate_7d());
            channelQuality.put("retention_rate_30d",channelCommonStat.getRetention_rate_30d());
            channelQuality.put("login_num",channelCommonStat.getLogin_num());
            channelQuality.put("first_week_pay_rate",channelCommonStat.getFirst_week_pay_rate());

            channelQualityMapList.add(channelQuality);
            sumNewloginNum += channelCommonStat.getNewlogin_num();
        }
        List channelQualityTable = new ArrayList();
        for(Map<String,Object> channelQuality:channelQualityMapList){
            channelQuality.put("newlogin_rate",calculateUserRate(Float.valueOf(channelQuality.get("newlogin_num").toString()),sumNewloginNum));
            channelQualityTable.add(channelQuality);
        }

        List<Do_channel_common_stat> channelCommonStatList = mapperChannelCommonStat.getChannelCommonStatByGameIdAndDate(gameId,startDate,endDate);
        List<String> x_axis = new ArrayList<>();
        if(channelCommonStatList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(channelCommonStatList.get(0).getData_date(), channelCommonStatList.get(channelCommonStatList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_newlogin = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_1d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_7d = new HashMap<>();
        Map<String,Object> y_axis_retention_rate_30d = new HashMap<>();
        Map<String,Object> y_axis_login = new HashMap<>();

        for(Do_channel_common_stat channelCommonStat:channelCommonStatList){
            String statDate = DateUtil.getPartitionString(channelCommonStat.getData_date());

            Map<String,Object> newloginMap = CommonUtil.Object2Map(y_axis_newlogin.get(channelCommonStat.getChannel_id()));
            Map<String,Object> rate1dMap = CommonUtil.Object2Map(y_axis_retention_rate_1d.get(channelCommonStat.getChannel_id()));
            Map<String,Object> rate7dMap = CommonUtil.Object2Map(y_axis_retention_rate_7d.get(channelCommonStat.getChannel_id()));
            Map<String,Object> rate30dMap = CommonUtil.Object2Map(y_axis_retention_rate_30d.get(channelCommonStat.getChannel_id()));
            Map<String,Object> loginMap = CommonUtil.Object2Map(y_axis_login.get(channelCommonStat.getChannel_id()));
            newloginMap.put(statDate,channelCommonStat.getNewlogin_num());
            rate1dMap.put(statDate,channelCommonStat.getRetention_rate_1d());
            rate7dMap.put(statDate,channelCommonStat.getRetention_rate_7d());
            rate30dMap.put(statDate,channelCommonStat.getRetention_rate_30d());
            loginMap.put(statDate,channelCommonStat.getLogin_num());

            y_axis_newlogin.put(channelCommonStat.getChannel_id(),newloginMap);
            y_axis_retention_rate_1d.put(channelCommonStat.getChannel_id(),rate1dMap);
            y_axis_retention_rate_7d.put(channelCommonStat.getChannel_id(),rate7dMap);
            y_axis_retention_rate_30d.put(channelCommonStat.getChannel_id(),rate30dMap);
            y_axis_login.put(channelCommonStat.getChannel_id(),loginMap);
        }



        Map<String,Object> channelCompare = new HashMap<>();
        channelCompare.put("x_axis",x_axis);
        channelCompare.put("y_axis_newlogin",setChannelYAxisDateMapToList(x_axis,y_axis_newlogin));
        channelCompare.put("y_axis_retention_rate_1d",setChannelYAxisDateMapToList(x_axis,y_axis_retention_rate_1d));
        channelCompare.put("y_axis_retention_rate_7d",setChannelYAxisDateMapToList(x_axis,y_axis_retention_rate_7d));
        channelCompare.put("y_axis_retention_rate_30d",setChannelYAxisDateMapToList(x_axis,y_axis_retention_rate_30d));
        channelCompare.put("y_axis_login",setChannelYAxisDateMapToList(x_axis,y_axis_login));

        Map<String, Object> result = new HashMap<>();
        result.put("channel_table",channelQualityTable);
        result.put("channel_compare",channelCompare);
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    private Map<String,Object> setChannelYAxisDateMapToList(List<String> xAxisList,Map<String,Object> channelYAxisDateMap){
        Map<String,Object> channelYAxisDateListMap = new HashMap<>();
        for (Map.Entry<String, Object> entry : channelYAxisDateMap.entrySet()) {
            String channelId = entry.getKey();
            Map<String,Object> dateValMap = (Map<String, Object>) entry.getValue();
            List<Object> dateValList = CommonUtil.getXAxisDataWithYAxisMap(xAxisList,dateValMap);
            channelYAxisDateListMap.put(channelId,dateValList);
        }
        return channelYAxisDateListMap;
    }

    public DataResult getOperationChannelPay(Integer gameId, String startDate, String endDate) {
        List<Do_channel_common_stat> channelPayList = mapperChannelCommonStat.getChannelPayByGameId(gameId,startDate,endDate);
        List<Map<String,Object>> channelPayTable = new ArrayList();

        for(Do_channel_common_stat channelCommonStat:channelPayList){
            Map<String,Object> channelPay = new HashMap<>();
            channelPay.put("channel_id",channelCommonStat.getChannel_id());
            channelPay.put("pay_amount",channelCommonStat.getPay_amount());
            channelPay.put("pay_times",channelCommonStat.getPay_times());
            channelPay.put("pay_num",channelCommonStat.getPay_num());
            channelPay.put("pay_rate",channelCommonStat.getPay_rate());
            channelPay.put("arpu",CommonUtil.FloatSet2Scale(channelCommonStat.getArpu()));
            channelPay.put("arppu",CommonUtil.FloatSet2Scale(channelCommonStat.getArppu()));

            channelPayTable.add(channelPay);
        }

        List<Do_channel_common_stat> channelCommonStatList = mapperChannelCommonStat.getChannelCommonStatByGameIdAndDate(gameId,startDate,endDate);
        List<String> x_axis = new ArrayList<>();
        if(channelCommonStatList.size() > 0) {
            x_axis = CommonUtil.getDatesBetweenTwoDate(channelCommonStatList.get(0).getData_date(), channelCommonStatList.get(channelCommonStatList.size() - 1).getData_date());
        }
        Map<String,Object> y_axis_pay_amount = new HashMap<>();
        Map<String,Object> y_axis_pay_times = new HashMap<>();
        Map<String,Object> y_axis_pay_num = new HashMap<>();
        Map<String,Object> y_axis_pay_rate = new HashMap<>();
        Map<String,Object> y_axis_arpu = new HashMap<>();
        Map<String,Object> y_axis_arppu = new HashMap<>();

        for(Do_channel_common_stat channelCommonStat:channelCommonStatList){
            String statDate = DateUtil.getPartitionString(channelCommonStat.getData_date());

            Map<String,Object> payAmountMap = CommonUtil.Object2Map(y_axis_pay_amount.get(channelCommonStat.getChannel_id()));
            Map<String,Object> payTimesMap = CommonUtil.Object2Map(y_axis_pay_times.get(channelCommonStat.getChannel_id()));
            Map<String,Object> payNumMap = CommonUtil.Object2Map(y_axis_pay_num.get(channelCommonStat.getChannel_id()));
            Map<String,Object> payRateMap = CommonUtil.Object2Map(y_axis_pay_rate.get(channelCommonStat.getChannel_id()));
            Map<String,Object> arpuMap = CommonUtil.Object2Map(y_axis_arpu.get(channelCommonStat.getChannel_id()));
            Map<String,Object> arppuMap = CommonUtil.Object2Map(y_axis_arppu.get(channelCommonStat.getChannel_id()));
            payAmountMap.put(statDate,channelCommonStat.getPay_amount());
            payTimesMap.put(statDate,channelCommonStat.getPay_times());
            payNumMap.put(statDate,channelCommonStat.getPay_num());
            payRateMap.put(statDate,channelCommonStat.getPay_rate());
            arpuMap.put(statDate,channelCommonStat.getArpu());
            arppuMap.put(statDate,channelCommonStat.getArppu());

            y_axis_pay_amount.put(channelCommonStat.getChannel_id(),payAmountMap);
            y_axis_pay_times.put(channelCommonStat.getChannel_id(),payTimesMap);
            y_axis_pay_num.put(channelCommonStat.getChannel_id(),payNumMap);
            y_axis_pay_rate.put(channelCommonStat.getChannel_id(),payRateMap);
            y_axis_arpu.put(channelCommonStat.getChannel_id(),arpuMap);
            y_axis_arppu.put(channelCommonStat.getChannel_id(),arppuMap);
        }
        Map<String,Object> channelCompare = new HashMap<>();
        channelCompare.put("x_axis",x_axis);
        channelCompare.put("y_axis_pay_amount",setChannelYAxisDateMapToList(x_axis,y_axis_pay_amount));
        channelCompare.put("y_axis_pay_times",setChannelYAxisDateMapToList(x_axis,y_axis_pay_times));
        channelCompare.put("y_axis_pay_num",setChannelYAxisDateMapToList(x_axis,y_axis_pay_num));
        channelCompare.put("y_axis_pay_rate",setChannelYAxisDateMapToList(x_axis,y_axis_pay_rate));
        channelCompare.put("y_axis_arpu",setChannelYAxisDateMapToList(x_axis,y_axis_arpu));
        channelCompare.put("y_axis_arppu",setChannelYAxisDateMapToList(x_axis,y_axis_arppu));

        Map<String, Object> result = new HashMap<>();
        result.put("channel_table",channelPayTable);
        result.put("channel_compare",channelCompare);
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }


    public DataResult getMenuByGameId(Integer gameId) {
        List<Do_game_sys_analyse_config> gameSysAnalyseConfigList = mapperGameSysAnalyseConfig.findMenuConfigByGameId(gameId);

        Map parentMenu_temp = new HashMap();
        List parentMenu_order = new ArrayList();
        for(Do_game_sys_analyse_config gameSysAnalyseConfig:gameSysAnalyseConfigList){
            if(null != gameSysAnalyseConfig.getMenu_ico() && gameSysAnalyseConfig.getMenu_ico().length() > 0){
                Map<String,Object> parent = new HashMap<>();
                parent.put("name",gameSysAnalyseConfig.getMenu());
                parent.put("ico",gameSysAnalyseConfig.getMenu_ico());
                parentMenu_temp.put(gameSysAnalyseConfig.getMenu(),parent);
                parentMenu_order.add(gameSysAnalyseConfig.getMenu());
            }
        }
        for(Do_game_sys_analyse_config gameSysAnalyseConfig :gameSysAnalyseConfigList){
            Set keys = parentMenu_temp.keySet();
            for(Object o : keys){
                if(gameSysAnalyseConfig.getMenu().equals(o)){
                    Map map = (Map)parentMenu_temp.get(o);
                    List childList = CommonUtil.Object2List(map.get("child"));
                    Map child = new HashMap();
                    child.put("name",gameSysAnalyseConfig.getSub_menu());
                    child.put("id",gameSysAnalyseConfig.getChart_id());
                    if(!gameSysAnalyseConfigContains(childList,child)) {
                        childList.add(child);
                    }
                    map.put("child",childList);
                    parentMenu_temp.put(o,map);
                }
            }
        }

        List parentMenu = new ArrayList();
        for(Object o:parentMenu_order){
            parentMenu.add(parentMenu_temp.get(o));
        }
        Map<String, Object> result = new HashMap<>();
        result.put("menu",parentMenu);
        result.put("abnormal",getAbnormalColumns(gameId));
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    private Boolean gameSysAnalyseConfigContains(List list,Map map){
        for (Object o : list){
            Map temp = (Map) o;
            if(temp.get("name").equals(map.get("name"))){
                return true;
            }
        }
        return false;
    }

    public DataResult getPageByMenuId(Integer gameId,Integer chartId,String startDate,String endDate) {

        Do_game_sys_analyse_config gameSysAnalyseConfigMenu = mapperGameSysAnalyseConfig.findMenuConfigByChartId(chartId);
        List<Do_game_sys_analyse_config> gameSysAnalyseConfigList = mapperGameSysAnalyseConfig.findMenuConfigByGameIdAndMenu(gameId,gameSysAnalyseConfigMenu.getSub_menu());
        List resultList = new ArrayList();
        Map<String,Object> chartMap = new HashMap<>();
        List<String> tableList = new ArrayList();
        for (Do_game_sys_analyse_config gameSysAnalyseConfigChart: gameSysAnalyseConfigList){
            List chartList = CommonUtil.Object2List(chartMap.get(gameSysAnalyseConfigChart.getTable_name()));
            Map<String,Object> chart = new HashMap<>();
            chart.put("name",gameSysAnalyseConfigChart.getChart_name());
            chart.put("chart_type",gameSysAnalyseConfigChart.getForm_type().getFormType());
            chart.put("chart_explain",gameSysAnalyseConfigChart.getChart_explain());
            Map<String,Object> params = new HashMap<>();
            params.put("data_date",endDate);
            params.put("start_date",startDate);
            params.put("end_date",endDate);
            chart.put("data",this.getDataBySQL(gameSysAnalyseConfigChart.getSql_template(),params,gameSysAnalyseConfigChart.getForm_type()));
            chartList.add(chart);
            chartMap.put(gameSysAnalyseConfigChart.getTable_name(),chartList);
            if (!tableList.contains(gameSysAnalyseConfigChart.getTable_name())){
                tableList.add(gameSysAnalyseConfigChart.getTable_name());
            }
        }

        for(String tableName:tableList){
            Map<String,Object> table = new HashMap<>();
            table.put("name",tableName);
            table.put("data",chartMap.get(tableName));
            resultList.add(table);
        }

        return new DataResult(ReturnCodeDim.SUCCESS,resultList);
    }

    private Object getDataBySQL(String sql, Map<String,Object> params, ChartForm chartForm){
        String sqlParamStr = StringUtil.getSQLParams(sql).trim();
        if(sqlParamStr.length() > 0){
            String[] sqlParams = sqlParamStr.split(",");
            if(sqlParams.length > 0){
                for(String param : sqlParams){
                    String value = null;
                    if(null != params){
                        value = (String) params.get(param);
                    }
                    if(null == value && param.equals("data_date")){
                        value = DateUtil.getOffsetDatePartitionString(new Date(),-1);
                    }
                    if(null == value && param.equals("start_date")){
                        value = DateUtil.getOffsetDatePartitionString(new Date(),-30);
                    }
                    if(null == value && param.equals("end_date")){
                        value = DateUtil.getOffsetDatePartitionString(new Date(),-1);
                    }
                    sql = sql.replace("#{"+param+"}",value);
                }
            }
        }
        List<Map> data =  mapperGameFormConfig.findDataBySQL(sql);
        return SQLDataFormatUtil.formatSQLData(data,chartForm);
    }


    public Map getAbnormalColumns(Integer gameId) {
        Do_game_common_stat_day gameCommonStatDay = mapperGameMenuTableMap.getAbnormalGameCommonStatDay(gameId);
        Do_game_retention_stat gameRetentionStat = mapperGameMenuTableMap.getAbnormalGameRetentionStat(gameId);
        Do_pay_user_potential_lost_stat payUserPotentialLostStat = mapperGameMenuTableMap.getAbnormalPayUserPotentialLost(gameId);
        Do_lost_user_common_analysis lostUserCommonAnalysis = mapperGameMenuTableMap.getAbnormalLostUserCommonAnalysis(gameId);
        Do_user_habit_play_time_stat userHabitPlayTimeStatDay = mapperGameMenuTableMap.getAbnormalUserHabitPlayTimeStatDay(gameId);
        Do_user_habit_play_time_stat userHabitPlayTimeStatWeek = mapperGameMenuTableMap.getAbnormalUserHabitPlayTimeStatWeek(gameId);
        Do_channel_common_stat channelCommonStat = mapperGameMenuTableMap.getAbnormalChannelCommonStat(gameId);
        Do_pay_common_stat_week payCommonStatWeek = mapperGameMenuTableMap.getAbnormalPayCommonStatWeek(gameId);
        Do_lost_common_stat lostCommonStatDay = mapperGameMenuTableMap.getAbnormalLostCommonStatDay(gameId);

        List<Do_game_menu_table_map> totalList = new ArrayList<>();

        if(null!=gameCommonStatDay&&null!=gameCommonStatDay.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"game_common_stat_day",gameCommonStatDay.getAbnormal_columns());
            totalList.addAll(tempList);
        }
        if(null!=gameRetentionStat&&null!=gameRetentionStat.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"game_retention_stat",gameRetentionStat.getAbnormal_columns());
            totalList.addAll(tempList);
        }
        if(null!=payUserPotentialLostStat&&null!=payUserPotentialLostStat.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"pay_user_potential_lost_stat",payUserPotentialLostStat.getAbnormal_columns());
            totalList.addAll(tempList);
        }
        if(null!=lostUserCommonAnalysis&&null!=lostUserCommonAnalysis.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"lost_user_common_analysis",lostUserCommonAnalysis.getAbnormal_columns());
            String param = "lost_type="+lostUserCommonAnalysis.getLost_type()+",user_type="+lostUserCommonAnalysis.getUser_type();
            List<Do_game_menu_table_map> gameMenuTableMaps = new ArrayList<>();
            for (Do_game_menu_table_map gameMenuTableMap:tempList){
                //lost_type=7d,user_type=total
                if(param.equals(gameMenuTableMap.getPatam())){
                    gameMenuTableMaps.add(gameMenuTableMap);
                }
            }
            if(gameMenuTableMaps.size()>0){
                totalList.addAll(gameMenuTableMaps);
            }
        }
        if(null!=userHabitPlayTimeStatDay&&null!=userHabitPlayTimeStatDay.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"user_habit_play_time_stat_day",userHabitPlayTimeStatDay.getAbnormal_columns());
            String param = "user_type="+userHabitPlayTimeStatDay.getUser_type();
            List<Do_game_menu_table_map> gameMenuTableMaps = new ArrayList<>();
            for (Do_game_menu_table_map gameMenuTableMap:tempList){
                //user_type=potential_pay
                if(param.equals(gameMenuTableMap.getPatam())){
                    gameMenuTableMaps.add(gameMenuTableMap);
                }
            }
            if(gameMenuTableMaps.size()>0){
                totalList.addAll(gameMenuTableMaps);
            }
        }
        if(null!=userHabitPlayTimeStatWeek&&null!=userHabitPlayTimeStatWeek.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"user_habit_play_time_stat_week",userHabitPlayTimeStatWeek.getAbnormal_columns());
            String param = "user_type="+userHabitPlayTimeStatWeek.getUser_type();
            List<Do_game_menu_table_map> gameMenuTableMaps = new ArrayList<>();
            for (Do_game_menu_table_map gameMenuTableMap:tempList){
                //user_type=potential_pay
                if(param.equals(gameMenuTableMap.getPatam())){
                    gameMenuTableMaps.add(gameMenuTableMap);
                }
            }
            if(gameMenuTableMaps.size()>0){
                totalList.addAll(gameMenuTableMaps);
            }

        }
        if(null!=channelCommonStat&&null!=channelCommonStat.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"channel_common_stat",channelCommonStat.getAbnormal_columns());
            totalList.addAll(tempList);
        }
        if(null!=payCommonStatWeek&&null!=payCommonStatWeek.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"pay_common_stat_week",payCommonStatWeek.getAbnormal_columns());
            totalList.addAll(tempList);
        }
        if(null!=lostCommonStatDay&&null!=lostCommonStatDay.getAbnormal_columns()){
            List<Do_game_menu_table_map> tempList = addGameMenuTableMap(gameId,"lost_common_stat_day",lostCommonStatDay.getAbnormal_columns());
            String param = "user_type="+lostCommonStatDay.getUser_type();
            List<Do_game_menu_table_map> gameMenuTableMaps = new ArrayList<>();
            for (Do_game_menu_table_map gameMenuTableMap:tempList){
                //user_type=potential_pay
                if(param.equals(gameMenuTableMap.getPatam())){
                    gameMenuTableMaps.add(gameMenuTableMap);
                }
            }
            if(gameMenuTableMaps.size()>0){
                totalList.addAll(gameMenuTableMaps);
            }
        }
        Map<String,Object> abnormalMap = new HashMap<>();
        for(Do_game_menu_table_map gameMenuTableMap : totalList){
            Map<String,Object> menuMap = CommonUtil.Object2Map(abnormalMap.get(gameMenuTableMap.getMenu()));
            Map<String,Object> menuData = CommonUtil.Object2Map(menuMap.get("data"));
            Integer menuNum = menuMap.get("num")==null?0:Integer.valueOf(menuMap.get("num").toString());
            Map<String,Object> childMenu = CommonUtil.Object2Map(menuData.get(gameMenuTableMap.getChild_menu()));
            Map<String,Object> childData = CommonUtil.Object2Map(childMenu.get("data"));
            Integer childNum = childMenu.get("num")==null?0:Integer.valueOf(childMenu.get("num").toString());
            Map<String,Object> title = CommonUtil.Object2Map(childData.get(gameMenuTableMap.getTitle()));
            title.put(gameMenuTableMap.getTag(),"0");
            childMenu.put("num",childNum+1);
            childData.put(gameMenuTableMap.getTitle(),title);
            childMenu.put("data",childData);
            menuMap.put("num",menuNum+1);
            menuData.put(gameMenuTableMap.getChild_menu(),childMenu);
            menuMap.put("data",menuData);
            abnormalMap.put(gameMenuTableMap.getMenu(),menuMap);
        }

        return abnormalMap;
    }

    private List<Do_game_menu_table_map> addGameMenuTableMap(Integer gameId,String tableName,String abnormalColumns){
        String[] abnormalColumnsArr;
        if(abnormalColumns.contains(",")){
            abnormalColumnsArr = abnormalColumns.split(",");
        }else {
            abnormalColumnsArr = new String[1];
            abnormalColumnsArr[0] = abnormalColumns;
        }
        List<Do_game_menu_table_map> resultList = new ArrayList<>();
        for(String abnormalColumn :abnormalColumnsArr){
            List<Do_game_menu_table_map> gameMenuTableMap = mapperGameMenuTableMap.getGameMenuTableMapListByTableAndColumn(gameId,tableName,abnormalColumn);
            resultList.addAll(gameMenuTableMap);
        }
        return resultList;
    }




}
