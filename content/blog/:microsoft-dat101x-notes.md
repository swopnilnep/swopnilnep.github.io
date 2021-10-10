---
title: "Microsoft's Introduction to Data Science"
date: 2020-06-16T02:40:57-05:00
description: "Summary notes for the Microsoft Introduction to Data Science Course"
draft: false
keywords: [Microsoft, Data Science, Machine Learning]
tags: [data-science, machine-learning]
toc: true
---

In summer of 2018, I took a short module from Microsoft on Coursera, called [DAT101x](https://learning.edx.org/course/course-v1:Microsoft+DAT101x+1T2018/home). The course was an Introduction to the fundamental concepts in Data Science with a brief preview of some ideas in Machine Learning, such as linear regression.

In addition to teaching Data Science Fundamentals, the course also introduced various ways to do Data Science in Microsoft products such as Excel or Azure Data Science Studio. 

I found it a great course for both reasons. If you are interested in getting a fundamental understanding of Data Science, I recommend it to you. 

This blog post includes the summary notes I took for the entire course. Enjoy!

## Module 1: An Introduction to Data

Intro: Exploring Data

### **Why do you like being a data scientist?**

* The world’s data is set to be doubling every couple of years

* Working with terabytes of data and making interpretations

* Exciting time to be a data scientist / Working with people in different fields

#### **What does a data scientist do?**

* Cleaning data (good enough to be trustworthy) — biggest challenge

* Understanding and prepping the data

* Seeing what kind of data formulations

* Parsing the data

#### **What kind of person succeeds?**

* You need to like data (dream about it!)

* Curiosity

* Collaborative and a problem solver (working with various individuals)

* Quick Learner

* New methodologies coming up everyday

#### **What skills does a data scientist need?**

* Handle on the statistics

* Communicate your findings to people

* Programming Languages (R, Python)

* Transform (using R, Azure etc)

#### **Aspiring Data Scientist?**

* Take some courses

* Look at available data spreads ([data.gov](http://data.gov/))

* Create models, write blogs (Machine Learning, get noticed by big companies)

* Work on projects that you are excited about (with people that inspire you, and seek to solve problems)

“Your Experience and your work is your currency”

### **1.1 Getting Started with Data**

“It is important to understand the fields of data and the kinds of information they hold”

#### **Fields of Data**

* Temporal: Relating to time (can do calculations but are not the same as numeric calculations)

* Text: They are strings and are usually represented as categorical data (ex. Sunday, Monday, Tuesday etc.)

* Numeric Data: Data that can be represented by a number

* Continuous Data: Can be put on a scale and compared with highest and lowest

* Discrete Data: Usually counting numbers

Sorting and Filtering Data

* Need to be aware of outliers (and filter them if needed)

* Cutoff data at points to get a better comparison

#### **Derived Data**

* Making new fields based on fields that already exist (ex. average, sum etc)

Highlighting

* Using Color intensity to visualize the value (heatmap data)

* Relative size using data bars

#### **Lab 1**

Weekday with the lowest temperature: Date 12/5/2017 T 22 R 1.82 F 11 Price 0.3 Sales 10

Number of flyers distributed in the month of Jan: 727

## Module 2: Data Analysis Fundamentals

### **2.1 Aggregating Data**

* First step to perform when you summarize the data

* Categorical Data: Distinct Count

* Sum: Common Aggregation of Interest (Numerical Data)

#### **Visual Representation**

* Line Graph: Changes in Values over time

* Pie Chart: Shows the percentage (Data Scientists don’t use it often)

* Bar Chart: Multiple Categories (Categorical Variables), you can add multiple series

* Scatterplot: Comparing two numeric Values

#### **Lab**

Total Sum of Revenue for August: 470.5

Hottest Saturday in July: 102.9

Lowest Number of Flyers distributed in a day during November: 26

Most flyers distributed: Wednesday

Least Flyers distributed: Saturday

Temperature vs. Rainfall: As rainfall increases, log temperature decreases

Date vs. tr: As date goes to the mid-yer, temp increases and rainfall decreases

## Module 3: Getting Started with Statistics

### **Measuring Central Tendency**

* Understand the common descriptive statistics

* Mean: sum / n

* Median: The middle term

* Mode: The most occurring data

### **Visualizing Data**

* Histogram: Portrays the data in frequency

* Box and whiskers chart

Measuring Variance

* Variance: Sum of the squared differences between each value and the mean / the number of observations

* var.p(range)

* var.s(range): variance of a sample

* Standard Deviation: Square root of the variance

* Stdev.s - standard deviation of a sample (The higher the standard deviation, the more variance)

* 1 standard deviation: 68.25%

* 2 standard deviation: 95.45%

* 3 standard deviation: 99.73%

Need to know the mean and the standard deviation.

### **Skewed Distributions**

* Where most of the data is centered

* Mean is higher or lower than median in the direction of the skewness

Working with Samples

* Generally work with samples of data vs. population

* How to make sure the samples are representative of the population?

* Take the largest sample possible

* Take a lot of random samples (The Central Limit Theorem, it will make a normal distribution and the mean of the sample mean will be equal to the mean of the population)

### **Correlation**

* Quantifying relation?

* COREL(range_x, range_y)

* +1 +ve : 0 : -1 -ve correlation

### **Hypothesis Testing**

* Null Hypothesis:

* H1 Mean for hot sales > mean sales for population

* Significance Level: 0.05

* z-test: if we know the standard deviation of the population

* t-test: returns the p-value

* if p-value is smaller than significance level -> reject null hypothesis

* p-value represents the probability of getting the mean value purely by random chance

Mean of the temperature sampling dist: 60.39628

Correlation between rainfall and sales: -.90921 / indicates that there is a inverse correlation)

Cannot reject the null hypothesis as p-value 0.935 > 0.05

## Module 4: Machine Learning Basics

* Need a way to train a computer to perform calculations

* x → values that we have

* y → values that we are trying to predict

### **Types of Machine Learning**

Supervised

* Start with observations with known values (labels)

* Use a machine learning algorithm to fit a label

* We compare the value predicted to the actual value that we had in the first place

* Add unknown values to make predictions about new values

Unsupervised

* Don’t have a known label in the training data set

* Each new observation is assigned to a cluster of observations with similar characteristics

Regression

* RMSE (Root Mean Squared Error): Measure of the standard deviation

* MAE (Mean Absolute Error): Average of all the model errors

* Relative absolute error: MAE relative to the mean value of the label (0, 1) (evaluate performance)

* Relative Squared Error: RMSE divided by the sum of the squares of the label

* R-squared: Coefficient of determination (R-squared of the model, represents the predictive power of the model as a value between 0 and 1) 1 is perfect

Classification

* Which class or category something belongs to

* Binary classification (T or F)

* False Positives / True Negative  : If the model predicts 0 or 1 but the actual label is the opposite

### Confusion Matrix: Calculating performance metrics for a classifier

* Accuracy is not useful for a measure of model’s performance

* Precision: The fraction of cases that are classified as positive that are actually positive.

* Recall (true positive rate) : The number of true positives / combines true positives and false negatives

Reciever Operating Characteristic (ROC):

* Area under the AUC is an indication of how well the model predicts (0, 0.5 is guessing, 1 is perfect)

Clustering (Unsupervised)

* K-means clustering

* Plot the data in a n-dimensional space (numeric values)

* Decide how many clusters you want to create

* Randomize the centroid

* Reposition the centroid

* Reallocate to the base of the centroid