package cn.thinkingdata.web.domain.custom;


public class Custom_service_dim {

    Integer service_type;
    String service_name;
    Integer use_format;
    Integer game_scope;

    public Integer getService_type() {
        return service_type;
    }

    public void setService_type(Integer service_type) {
        this.service_type = service_type;
    }

    public String getService_name() {
        return service_name;
    }

    public void setService_name(String service_name) {
        this.service_name = service_name;
    }

    public Integer getUse_format() {
        return use_format;
    }

    public void setUse_format(Integer use_format) {
        this.use_format = use_format;
    }

    public Integer getGame_scope() {
        return game_scope;
    }

    public void setGame_scope(Integer game_scope) {
        this.game_scope = game_scope;
    }
}
