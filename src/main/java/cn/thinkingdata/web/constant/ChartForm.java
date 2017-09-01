package cn.thinkingdata.web.constant;

/**
 * Created by Carpenter on 2017/3/6.
 */
public enum ChartForm {
    /**
     * 饼状图orientation
     */
    PIE_CHART(1),
    /**
     * 横向柱状图
     */
    ORIENTATION_BAR_GRAPH(2),
    /**
     * 折线图
     */
    LINE_CHART(3),
    /**
     * 纵向柱状图
     */
    PORTRAIT_BAR_GRAPH(4),
    /**
     * 堆积折线图
     */
    STACKED_LINE_CHART(5),
    /**
     * 数据表格
     */
    DATA_TABLE(6),
    /**
     * 柱状折线图
     */
    LINE_BAR_GRAPH(7),
    /**
     * 带筛选条件的柱状图
     */
    OPTIONS_BAR_GRAPH(8),
    /**
     * 带筛选条件的表格
     */
    OPTIONS_DATA_TABLE(9);

    private int formType;

    ChartForm(int formType) {
        this.formType = formType;
    }

    public int getFormType() {
        return formType;
    }
}
