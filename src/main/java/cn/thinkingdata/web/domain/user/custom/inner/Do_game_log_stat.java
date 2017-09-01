package cn.thinkingdata.web.domain.user.custom.inner;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/9/18.
 */
public class Do_game_log_stat {

    @JSONField(serialize = false)
    private Integer game_id;
    @JSONField (format="yyyy-MM-dd")
    private Date data_date;
    @JSONField(serialize = false)
    private String log_type;
    private Integer log_num;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Date getData_date() {
        return data_date;
    }

    public void setData_date(Date data_date) {
        this.data_date = data_date;
    }

    public String getLog_type() {
        return log_type;
    }

    public void setLog_type(String log_type) {
        this.log_type = log_type;
    }

    public Integer getLog_num() {
        return log_num;
    }

    public void setLog_num(Integer log_num) {
        this.log_num = log_num;
    }
}
