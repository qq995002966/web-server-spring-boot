package cn.thinkingdata.web.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/3/7 17:37
 * @description UserType
 */
public enum UserType {
    ACTIVE("active"),
    PAID("paid"),
    LOST("lost"),
    TOTAL("total");
    private String value;

    UserType(String userType) {
        this.value = userType;
    }

    private static final Map<String, UserType> stringToEnum = new HashMap<String, UserType>();
    static {
        for(UserType userType : values()) {
            stringToEnum.put(userType.toString(), userType);
        }
    }

    public static UserType fromString(String symbol) {
        return stringToEnum.get(symbol);
    }

    public String getUserType(){
        return this.value;
    }

    @Override
    public String toString() {
        return value;
    }
}
