<template>
  <div>
    <h2>Motivation for large margin classifiers</h2>
    <p>
      Remember that with logistic regression we assume that training data is generally linearly separable and our objective is to find a decision boundary between them. Of course, if there are outliers logicstic regression may still work well enough, and there are interesting hacks that can be used to apply even logistic regression to more than two classes.
    </p>
    <p>
      As a result, it turns out that logistic regression could probably be used in many of the cases that one may choose a large margin classifier, but the latter is computationally less expensive and may provide a cleaner and more accurate decision boundary.
    </p>
    <p>
      Large margin classifiers are probably always chosen over logistic regression in practice, but it is helpful to describe them by formulating logistic regression first.
    </p>
    <p>
      (Note that large margin classifiers are commonly called Support Vector Machines, but for consistency I continue to refer to them as large margin classifiers throught the rest of this page.)
    </p>

    <h2>Logistic regression</h2>
    <p>
      Logistic regression gives us a function by which we can learn to predict whether or not a data point belongs to class 0 or 1:
    </p>
    <p>
      $$h(\theta) = \frac{1}{1 + e^{-\theta^Tx}}$$
    </p>
    <p>
      \(h(\theta)\) is a good predictor if \(\theta^Tx\) is really big when y (the true class label) is equal to 1, and \(\theta^Tx\) is really small when y is equal to 0.
    </p>
    <p>
      The loss incurred given input example \(x^i\) and a set of parameters \(\theta\) is:
    </p>
    <p>
      $$J(\theta) = -\Big(y^i \cdot log(h_{\theta}(x^i)) + (1 - y^i) \cdot log(1 - h_{\theta}(x^i))\Big)$$
    </p>
    <p>
      For example, if \(\theta^Tx\) is really big, \(h(\theta)\) ends up predicting that y = 1. \(log(1) = 0\), so the total loss given these particular parameters for this training example \(i\) is 0.
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./logistic-regression.png' style='height:200px'/>
      <p style='width: 300px;color:#888'>Loss function for logistic regression in the case where y = 1.</p>
    </div>
    <p>
      Even in the case where \(h(\theta)\) correctly predicts y = 1, training data will continue to affect the output of the loss function. More interestingly, data points that lie further from the decision boundary have a much larger affect on the loss function.
    </p>

    <h2>Large margin classification</h2>
    <p>
      Often, hinge loss is used in place of logistic loss to change the cost distribution. As long as \(\theta^Tx\) is "good enough", it will no longer change the loss. Likewise, the cost grows only linearly as \(\theta^Tx\) becomes further from the correct prediction.
    </p>
    <p>
      Another property of the hinge loss is its computational efficiency.
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./large-margin.png' style='height:200px'/>
      <p style='width: 300px;color:#888'>The green, \(cost_1\) line is our new cost function.</p>
    </div>
    <p>
      This brings us to our loss function for large margin classifiers:
    </p>
    <p>
      $$J(\theta) = C \sum_{i=1}^{m}\Big(y^i \cdot cost_1(\theta^Tx^i) + (1 - y^i)cost_0(\theta^Tx^i)\Big) + \frac{1}{2}\sum_{j=1}^{n}\theta^2_j$$
    </p>
    <div style='display:flex;justify-content:center;margin-bottom:20px'>
      <ul>
        <li>When \(y = 1\), we want \(\theta^Tx\) to be >= 1</li>
        <li>When \(y = 0\), we want \(\theta^Tx\) to be &lt;= -1</li>
      </ul>
    </div>
    <p>
      C helps us to control how much each training example effects the total loss: By choosing a larger C our there is more motivation to overfit our model to the training data.
    </p>
    <p>
      Also note the use of L2 regularization: \(\frac{1}{2}\sum_{j=1}^{n}\theta^2_j\). In the next section, we'll see why this, paired with our constraints on \(\theta^Tx\), leads to a more intuitive decision boundary.
    </p>

    <h2>Large margin intuition</h2>

    <p>
      We'll use the following known properties in this section:
    </p>
    <ol>
      <li>
        \(u^Tv = p \cdot \Vert u \Vert\), where \(p\) is the length of the projection of \(v\) onto \(u\)
      </li>
      <li>
        \(\Vert u \Vert = \sqrt{u_1^2 + u_2^2}\)
      </li>
    </ol>
    <p>
      Consider the fact that we used L2 regularization in our objective function. By applying the second of these properties:
    </p>
    <p>
      $$\frac{1}{2}\sum_{j=1}^{n}\theta^2_j = \frac{1}{2} \Big(\sqrt{\theta_0^2 + \theta_1^2}\Big)^2 = \frac{1}{2} \Vert \theta \Vert^2$$
    </p>
    <p>
      Remember that during optimization, we want \(\theta^Tx\) to be >= 1. If our regularization term is weighted sufficiently (with a small enough C), we will be focused more on minimizing \(\theta\) and less on fitting the decision boundary to each training instance. Therefore, during optimization we will be maximizing the projection of x onto \(\theta\) because for \(p \cdot \Vert \theta \Vert >= 1\) to hold true, \(p\) will have to be very large.
    </p>
    <p>
      It's pretty hard to draw this relationship in a way that ends up being convincing, but I'll do my best. The first illustration shows a decision boundary that a large margin classifier would probably find:
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./good.png' style='height:200px'/>
      <p style='width: 300px;color:#888'>The solid green line represents the vector \(\theta\). The dotted green line represents the resulting decision boundary. The magenta line shows that the training example with the shortest projection onto \(\theta\) has been maximized.</p>
    </div>
    <p>
      Each line is described in the caption, but the main point here is that for each of the training examples, the classifer is attempting to maximize its projection onto \(\theta\). As a result, we get this imaginary decision boundary that is far from each of the training examples.
    </p>
    <p>
      To see an example of a bad classification, see the image below:
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./bad.png' style='height:200px'/>
      <p style='width: 300px;color:#888'>The magenta line here is the nearest projection given the same training examples, but a different \(\theta\) vector. The dashed green line makes it clear which example is projecting.</p>
    </div>
    <p>
      This example, while still perfectly separating all of the training examples, is still not very good one. That's because the projections of many of the training examples onto \(\theta\) are much smaller than they were in the illustration above.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'Main'
  };
</script>

<style scoped>
  .image-container {
    padding: 18px;
    display: flex;
    justify-content: center;
  }
</style>
