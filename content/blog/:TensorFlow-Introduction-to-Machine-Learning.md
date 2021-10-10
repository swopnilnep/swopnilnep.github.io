---
title: "TensorFlow: Introduction to Machine Learning"
date: 2020-12-25T22:54:18-06:00
slug: ""
description: "A summary of Google's Introduction to Machine Learning Crash Course"
keywords: [machine-learning, TensorFlow, Python]
draft: false
tags: [machine-learning, python]
math: false
toc: true
---
## About

The Introduction to Machine Learning Crash course, from Google which teaches Machine Learning Fundamentals using TensorFlow is a popular and brilliant way to begin Machine Learning. I took this self-paced over the time of a few weeks in 2018 and took some notes as I went. 

This blog post are my summary notes for that course. In addition to taking notes for the course, I also put together a playlist for all the videos of that course, for those who prefer to learn solely from YouTube. 

You can access the [playlist here](https://www.youtube.com/watch?v=0mK52UsOj-U&list=PLoMysrWTTHoGOIxG7wi_D1J2a1nLBndZb).

Here is the first video from the course, which is trailer to what the course is about. Enjoy!


<br>

{{< youtube 0mK52UsOj-U >}}

## 1.0 Supervised ML / Labels / Features

* What is a supervised ML?
* Creating models that combine inputs to produce useful predictions
* Never before seen data
* Label
* We are providing it with label (spam or not spam)
* It is what we are predicting (y variable in linear regression)
* Features
* Input variables (x in linear regression)
* Like the columns (email address, words in the email, time it was sent)
* What are labeled and unlabeled?
* Labeled contains both features and the label like (spam or not spam)
* Unlabeled contains features but not the label
* Unlabeled examples add new examples that humans haven't labeled
* Models
* Model defines the relationship between the features and the label
* Learning or training entails learning the relationship between the features and the label based on what the model is trying to predict
* Inference is applying the trained model to unlabeled examples (making predictions)
* Regression vs. Classification
* Regression: Predicts continuous values (more likely to work with numbers)
* Classification: Predicts discrete values (sort into categories)

## 2.0 Descending into ML: Linear Regression

* It is like finding the slope of a line where
* y' = b + w1x1 where:
* y' - predicted label
* b - bias (y-intercept)
* w1 - weight of feature 1
* x1 - feature (input)

### 2.1 Training and Loss

* **Empirical Risk Minimization** is the process the machine learning model uses for training by examining many examples and attempting to find a model that minimizes loss
* Loss is a number predicting how bad the model's prediction was on a single example
* The squared loss is a popular loss function for measuring the accuracy of linear regression: (observation - prediction(**x**))2
* Mean Squared Error (MSE) - Sum up all the squared losses per example over the whole dataset / number of examples

## 3.0 Reducing Loss: Iterative Approach

* Like the "hot and cold" kid's game for finding a hidden object
* The iterative process:
* Data comes in
* Make a prediction
* Calculate the squared loss (derivative of squared loss easy to compute)
* Compute the gradient of the loss function on the data
* We get a -ve or +ve gradient which tells us to update model parameter and get a new version of the model
* Repeat
* Rate depends on how big of a gap we decide to take
* Theory (math) tells us to compute the gradient over all examples in our dataset
* Empirically - Compute the gradient of the loss function over a single (stocastic gradient descent)
* Practically - Use a batch of gradient descents (mini-batch gradient descent)

### 3.1 Gradient Descent

* Calculating the loss function for every value of w over a convex problem would be inefficient
* We start gradient descent by picking a starting value (random value or 0, doesn't matter too much)
* The gradient always points in the direction of the steepest increase in the loss function. The algorithm then takes a step in the direction of the negative gradient in order to reduce loss as quickly as possible.
* To take the next point, the gradient descent add a fraction of the gradient's magnitude to the starting point
* Then the gradient descent repeats this process getting closer to the minimum

### 3.2 Learning Rate

* The gradients multiply the gradient by a scalar known as the **learning rate** (step size)
* Hyperparameters - values that are set before the machine learning takes place (programmers tweak), learning rate is a hyper parameter
* The value of the learning rate is related to how flat the function is, if the loss is small, then we can use a larger learning rate (small gradient / larger step size)

### 3.3 Stochastic Gradient Descent

* Batch is the total number of examples you use to calculate the gradient in a single iteration
* With a larger batch, there is more redundant data as the batch size grows
* SGD only uses 1 example per iteration (very noisy, but works) | stochastic means random
* Mini-batch SGD is a middle, takes between 10 and 1,000 examples

# 4.0 TensorFlow

* Graph based computational framework that have a lot of applications
* Estimators API - higher level API
* Lower level API (build models defining a series of mathematical operations)
* Higher Level API - Specify predefined architectures like linear regressors or neural networks
* TensorFlow consists of two components:
* Graph protocol buffer
* Runtime that executes the graph
* Like Python code and python interpreter, can run on multiple hardware platforms
* We should use the highest level of abstraction that solves the problem

#### 4.1.1 Steps

* Define features and configure feature columns (store a description of the feature data)
* Define the target
* Configure the LinearRegressor
* Define the input function
* Pandas feature data to NumPy arrays
* TensorFlow Dataset API to construct a dataset object from the data, break our data into batches of batch_size
* Train the Model
* Evaluate the Model

#### 4.1.2 Hyperparameters

* steps: total number of training iterations. One step calculates the loss from one batch and uses that to modify the model's weights once.
* batch size: the number of examples (randomized) for a single step. Ex. batch size for SGD is 1.
* total number of trained examples = batch size x steps
* periods: Controls the granularity of reporting. If periods is 7 and steps is 70, the exercise will output the loss value every 10 steps (7 times)

## 5.0 Generalization

* Generalization of data
* Overfitting of data - When it fits better with one example but does not fit all
* Ocham's Razor - A model should be as simple as possible
* Test set methodology
* One one set of data and use a training set
* Use another set of data and use a test set
* Assumptions:
* We are drawing independently and identically
* Distribution is stationary
* From the same distribution

## 6.0 Training and Test Sets

* Divide large dataset into two smaller sets (Randomization before splitting)
* Cross Validation (if small dataset)
* Do not train on your test data

## 7.0 Validation

* Testing repetitively on the same dataset can lead to overfitting to that particular case
* Iterations by training on the training data and validating on the validation data
* Finally test on the test data

## 8.0 Representation

* Feature Engineering (Process of extracting features from raw data)
* String value to feature value by one hot encoding
* Database records - does not come to us in the form of information
* Mapping Raw Data to Features:
    * Raw data: Data from an input source
    * Feature Vector: Floating point values comprising the examples in the dataset
    * Feature Engineering: Transforming raw data into a feature vector
* Mapping Numeric Values
    * It is trivial to convert integers to features
* Mapping Categorical Values
    * Strings are converted into numeric values
    * OOV bucket (out of vocabulary bucket) consists of the values that are not in the vocabulary of strings
    * One hot encoding extends to numeric data that you do not want to directly multiply by a weight (postal code)
* Qualities of Good Features:
    * Should appear more than 5 or so times in a data set (ex. house_type)
    * Should have a clear and obvious meaning
    * Should not have noisy data
    * Convert "magic" values into two features, (data_supplied, rating)
    * Definition feature should not change over time
* Cleaning Data
    * Scaling Feature Values
        * **Scaling** is converting floating point feature values from their natural range (100 to 900) to (0 to 1)
        * Helps gradient descent converge more quickly
        * Every number becomes NaN
        * Helps the model learn appropriate weights for each feature
            * Linearly map [min value, max value] to a scale such as [+1, -1]
            * scaledvalue = (value - mean)/stdev
            * Scaling with Z-Scores means that there will be values > 3 <
    * Handling Extreme Outliers:
        * Log Scaling: Still leaves a tail
        * Clipping Features: All the features beyond a number become a number
    * Binning
        * For features that have no linear relationship with the data
        * Binning by quantile removes the need for outliers
    * Scrubbing
        * Omitted Values: Person forgot to enter values
        * Duplicated Values: Uploaded the two logs
        * Bad Labels: A person labeled a picture of an oak tree as a maple
        * Bad feature values: Extra digit or a thermometer was left out in the sun
        * Use histograms, min and max, mean and median, standard deviation

## 9.0 Feature Crosses

* A linear problem is where you can fit a line to differentiate spam from not spam (depending on the input variables)
* Define a synthetic feature (cross product)
* Feature Crosses:
    * Bedrooms x
    * Linear learners scale to large datasets
* Crossing One-Hot Vectors:
    * Linear learners scale well to massive dat
* FTRL Optimization Algorithm
    * Benefits scaling the learning rate differently for different coefficients | scales the learning rate differently for different coefficients (can be useful if there are a lot of 0 values)

## 10.0 Regularization for Simplicity

* Minimizing Training Loss
* Regularization - Not trusting your examples too much
* Red line starts to go up (need to generalize on the test examples)
* Early Stopping (stopping before it starts to converge)
* Penalize the model complexity:
    * While we are training
    * Empirical Risk Minimization: minimize(loss(data|model))
    * Structural Risk Minimization: minimize(loss(data(model) + complexity(model))
* Model Complexity
    * Model complexity as a function of the weights of all the features in the model
    * Model complexity as a function of the total number of features with nonzero weights
* We quantify complexity using the L2 Regularization formula
* L2 Regularization - Sum of the squared values of the weights

## 11.0 Linear Regression

* Sometimes we might end up with a range beyond 0 and 1 (for probabilities) if we use Linear Regression
* Loss function and prediction method (never exceeds 0 or 1) Logistic Regression
* Classification Tasks, Probability etc
* Linear Model -> Sigmoid
* Training using a log loss (entropy measure)
* As you get closer to the bars, the loss get higher quickly
* Because of the asymptote, we need to use regularization (L2 regularization)
* Efficient to train, fast, efficient to use

## 12.0 Classification

* Is it spam or not spam?
* Making a classification threshold, evaluating classification performance is accuracy
* Accuracy breaks down if we have class imbalance
* True Positive, False Negative, True Negative, False Positive
* Precision - When the boy said wolf, how many times was he right?
* Recall - Of all, how many did he say wolf?
* Precision - Recall opposite
* What classification threshold are you using?
    * Across many different classification thresholds
    * ROC curve (Receiver Operating Characteristics)
    * Area under the ROC curve, When you pick a random positive and a random negative example, what is the probability that the model will get a higher score for the positive than the negative * The probability value is exctly the same probability for the prob under RC
    * Prediction Bias - Sum of everything predicted / sum of everything observed
    * Bias - Simplistic (Easy to fool) | Need to make zero bias
    * Calibration Plot - Take groups of data, bucket and look at mean prediction and mean observation
        * Coin Flip will come up 1 or 0

## 13.0 Regularization for Sparsity

* Feature crosses can cause problems
* Sparse features
* Words in a search query * Unique video that we have to look up
* Model size will take memory
* Noisy Coefficients - Lose them
* Regularize - Model Size, memory usage
* L0 regularization - Zero out weights (not convex, hard to optimize)
* L1 Regularization - Sum of the absolute value of the weights
* L2 Regularization - Makes the weights small but won't actually drive them to 0

## 14.0 Neural Nets

* Learn the non-linearity themselves - Image, audio and video data
* Model with structure
* Linear Model - nonlinearity by additional layer (RELU, Sigmoid, Tanh)
* When training - non-convex optimization
* Backpropagation is a variant of gradient descent

## 15.0 Training Neural Nets

* We need differentiable functions
* Gradients vanish (noise ratios)
* Gradients can explode (learning rates are too high)
* ReLus can die (if we end up at everything below 0)
* All of the inputs are on roughly the same scale
* Drop out regularization - p, remove the node on each gradient step

## 16.0 Multi-Class Neural Nets

* Classification for binary class problems
* Pick a label out of a range of classes
* One vs. all multiclass classification
* If the neural nets belong to only one class, make the sum of the total outputs to 1 (using Softmax)
* Multilabel Classification problem - 3 different dogs, dog and a person (1 vs. all classification strategy) - using full Softmax which is expensive to train
* Candidate Sampling - Train the output nodes for the set that it belongs to

## 17.0 Embeddings

* Collaborating Samples
* 1-dimensional embedding
* Multi-dimensional embedding