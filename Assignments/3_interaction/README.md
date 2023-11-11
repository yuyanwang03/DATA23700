# Instructions to launch

In the terminal, navigate to the folder containing the file `index.html` using the `cd` command. You need to download a local copy of the entire folder with everything in it in order for this to work. Once inside the correct directory in the terminal, run the following command:

```
python3 -m http.server --bind 127.0.0.1
```

This sets up a localhost server on your machine which you can use for basic web development. View the webpage by navigating to the URL provided in the terminal output. If all is well, the URL should be [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Report

When deciding between D3 and Altair for creating data visualizations, there are several factors to consider; I've chosen to do the assignment with D3 because it seemed more challenging and it is a good opportunity to try a new library and a new programming language. D3.js provides a low-level, highly customizable framework for building complex and interactive visualizations from scratch. It allows for granular control over the final appearance and interactivity of visualizations, which is a good choice when our requirements are unique or when we need to optimize performance for large datasets. D3's flexibility can be especially advantageous for creating visualizations with advanced interactivity, such as crossfiltering between different data views in this case. However, the work behing a D3 visualization is huge (as it can be observed from my delivered work) and understanding all its complexity is much more time consuming than using Altair. On the other hand, Altair offers a higher-level, declarative approach to visualization. This makes it quicker and easier to create standard visualizations, as it requires less code. Altair also integrates seamlessly with the rest of the Python data science stack, which includes tools like Pandas and Jupyter notebooks. This integration is particularly beneficial for data science workflows, as it allows for more straightforward incorporation of visualizations into the data analysis process. In conlusion, D3 is a good tool when we need the utmost flexibility and are willing to handle the complexity that comes with it; Altair would be more suitable for situations where speed and ease of use are priorities, and when the visualizations required are more standard and can be described declaratively.

When it comes to visualization design, I initially focused on creating something simple yet achievable, which is the central idea of this design. It is evident that the dashboard only contains scatter plots, bar graphs, and histograms; these are precisely the types of graphs we have practiced in class and for exercise 6. I had considered adding a pie chart to the dashboard but decided against it due to time constraints. Furthermore, I determined that color embedding is not a crucial element for this assignment, as we are demonstrating our ability to create crossfiltering dashboards. Therefore, I used the same color template as in exercise 6. 

The charts are interconnected so that selecting an area on the central scatter plot will trigger corresponding brush effects on the other five graphs and vice versa. In other words, clicking on the bars of the bar plot or histogram highlights the related data points in the other graphs. I must mention that the only feature not functioning as intended is the selection/application of filters from the longitude and latitude scatter plot. I recognize that I could have chosen another feature to replace this plot, perhaps with a bar plot or a histogram, to circumvent this issue. However, I included the scatter plot in the dashboard to introduce more visual variety. I believe that with the other plots, I have successfully demonstrated a certain level of understanding of D3. I would also like to note that, given the large size of the dataset, the filters react more slowly and the transitions are not as smooth as desired.

After attempting to build an interactive visualization for this assignment, I've come to appreciate the benefits and also recognize the drawbacks of interactivity. On one hand, interactivity has allowed me to engage more deeply with the data; it is easier to gain a better understanding and discovered insights that might have been obscured in a static image. It has made the complex data approachable and allowed for a personalized exploration experience for any user who interacts with my visualization. On the other hand, I've encountered challenges that highlight the drawbacks of interactivity. The development process is certainly more complex and time-consuming.

## Work Preview


![InitialView](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_InitialView.png)

![CrossfilteringByEmbedingCoordinates](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_CrossfilteringByEmbedingCoordinates.png)

![CrossfilteringByMedianHouseAge](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_CrossfilteringByMedianHouseAge.png)

![CrossfilteringByMedianHouseValue](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_CrossfilteringByMedianHouseValue.png)

![CrossfilteringByMedianIncome](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_CrossfilteringByMedianIncome.png)

![CrossfilteringByOceanProximity](https://github.com/yuyanwang03/DATA23700/blob/main/Assignments/3_interaction/3_CrossfilteringByOceanProximity.png)
