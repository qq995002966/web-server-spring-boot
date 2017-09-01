package cn.thinkingdata.web.util.interceptor;

public class JudgeRule {
    private Integer timeSpan;
    private Integer times;
    private Integer sealedGrade;

    public Integer getTimeSpan() {
        return timeSpan;
    }

    public void setTimeSpan(Integer timeSpan) {
        this.timeSpan = timeSpan;
    }

    public Integer getTimes() {
        return times;
    }

    public void setTimes(Integer times) {
        this.times = times;
    }

    public Integer getSealedGrade() {
        return sealedGrade;
    }

    public void setSealedGrade(Integer sealedGrade) {
        this.sealedGrade = sealedGrade;
    }
}