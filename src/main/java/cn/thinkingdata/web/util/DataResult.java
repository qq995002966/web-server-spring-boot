package cn.thinkingdata.web.util;

import com.alibaba.fastjson.JSON;

import java.io.Serializable;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class DataResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer return_code;

    private String return_message;

    private Object data;

    public DataResult() {
        super();
    }
    
    public DataResult(int returnCode) {
        this.return_code = returnCode;
        this.return_message = ReturnCodeDim.getRetMsg(returnCode);
    }
    
    public DataResult(Object data) {
        this.return_code = 0;
        this.return_message = "";
        this.data = data;
    }

    public DataResult(Integer code, Object data) {
        this.return_code = code;
        this.return_message = ReturnCodeDim.getRetMsg(code);
        this.data = data;
    }

    public DataResult(Integer code, String message, Object data) {
        this.return_code = code;
        this.return_message = message;
        this.data = data;
    }

    public Integer getReturn_code() {
        return return_code;
    }

    public void setReturn_code(Integer return_code) {
        this.return_code = return_code;
    }

    public String getReturn_message() {
        return return_message;
    }

    public void setReturn_message(String return_message) {
        this.return_message = return_message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

}
