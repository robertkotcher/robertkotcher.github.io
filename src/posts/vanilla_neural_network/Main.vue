<template>
  <div>
    <h1>I made a Vanilla Neural Network from Scratch</h1>
    <h2>Motivation</h2>
    <p>
      As I continue to grow my understanding of deep learning, it seems an inevitable rite of passage to build a functional neural network without the help of libraries. I have tinkered with the likes of Keras and Tensorflow, always amazed by the results and still yet somehow unfulfilled knowing that the brilliance behind what was actually happening was inside the black box.
    </p>
    <p>
      This project started with the intention to calculate a few derivatives and translate those over to python code. In the end, I learned so much that it seemed worthwhile to write down every last detail to ensure that my future self would be able to revisit what I did without any confusion.
    </p>

    <h2>Neural networks are functions</h2>
    <p>
      I'll use the words "neural network" and "function" interchangeably in this writeup. The operations that together make up a neural network form a computational graph when expressed visually. We'll be walking through the example graph that is depicted below. It's actually pretty hard to illustrate every last computational detail visually, and I try to elaborate in words where the imagery is lacking.
    <p>
      In general, inputs to a neural network consist of some data that you are trying to understand, the function reshapes that data such that the output can be provide insight into the input. For just a few examples, the output can classify the input ("this is a picture of a cat") or it can predict the next value in a sequence ("My favorite movie is The Jedi Strikes ___").
    </p>
    <p>
      For now, it actually doesn't matter a whole lot what we expect our example network to do. We can assume that the data we use is arbitrary. This example is used more to show the mechanics neural networks, how to measure the success of their output, and how to optimize (or "train") their parameters in order to improve output accuracy.
    </p>
    <p>
      I mentioned that a neural network is just a function. Let's first look at what exactly this function looks like, and then we'll talk about how to "teach" this function to learn our task at hand.
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./basic-net.png' style='height:350px'/>
      <p style='width: 500px;color:#888'>A neural network with input \(X\), two bias parameters \(B_1\) and \(B_2\), a hidden layer with three neurons, and output \(O\). Edges connecting \(X\) to \(H\), and \(H\) to \(O\) each contain a weight. The image above only shows \(w_1\).</p>
    </div>
    <p>
      The image above is a representation of a pretty straightforward function. It takes two input scalars, passes them to a "hidden layer", which in turn spits out two output scalars. This same thing can be concisely represented with the function:
    </p>
    <p>$$f(\theta, X) = \phi_2(\phi_1(XW_1 + B_1)W_2 + B_2)$$</p>
    <p>
      The \(\theta\) stands for "all of the parameters involved in calculating the output of this function", and will be omitted from the function signature for brevity.
    </p>
    <h5>Expressing the transformation from \(X\) to \(H\) in matrix notation</h5>
    <p>
      Let's move across the network from left to right and see how this relates to the underlying math.
    </p>
    <p>The \(X\) matrix contains the inputs to our function. In this example it has one row and two columns.
    </p>
    <p>
      $$X = \begin{bmatrix}x_1 & x_2\end{bmatrix}$$
    </p>
    <p>
    You can see that \(X\) is multiplied by \(W_1\). I allude to \(W_1\) in the image above with \(w_1\), but \(W_1\) (capital "W") is a matrix containing the \(w_1\) edge weight together with 5 others.
    </p>
    <p>
      $$W_1 = \begin{bmatrix}w_1 & w_3 & w_5\\w_2 & w_4 & w_6\end{bmatrix}$$
    </p>
    <p>You'll often see a "bias" value, in this case \(B_1\), which is used to translate the hidden state away from the origin. In other words, bias values are added to the matrix that results from multiplying input values by the weight parameters.
    </p>
    <p>
      $$B_1 = \begin{bmatrix}b_{1,1} & b_{1,2} & b_{1,3}\end{bmatrix}$$
    </p>
    <p>
    Let's put together the first half of this network, which takes us from the input \(X\) to the hidden layer:
    </p>
    <p>
      $$XW_1 + B_1 = \begin{bmatrix}x_1 & x_2\end{bmatrix} \begin{bmatrix}w_1 & w_3 & w_5\\w_2 & w_4 & w_6\end{bmatrix} + \begin{bmatrix}b_{1,1} & b_{1,2} & b_{1,3}\end{bmatrix} = \begin{bmatrix}h_1 & h_2 & h_3\end{bmatrix} = H$$
    </p>
    <h5>Roles of each player</h5>
    <p>
      Each of the players mentioned so far have different roles, and I want to make sure I'm particularly clear on what those are before moving forward.
    </p>
    <p>
      \(X\), \(O\), and \(H\) are, for lack of a better word, "placeholders" in the computational graph. For each execution of the function they will be filled in based on the current input.
    </p>
    <p>
      The weight matrices \(W_1\) and \(W_2\), as well as biases \(B_1\) and \(B_2\) are referred to as "variables", or maybe more commonly "parameters" or "weights". These players stay the same between executions. It's our goal to figure out the best parameter values during the training process. Typically these are "initialized" with random numbers.
    </p>
    <h5>Activation functions</h5>
    <p>
    Returning to our function, we now arrive at the "hidden layer": \(H = \begin{bmatrix}h_1 & h_2 & h_3\end{bmatrix}\). There's one really important thing to note here: Each neuron \(h_i\) in the hidden layer is actually comprised of two numbers. The first is the immediate result of the matrix expression just mentioned. We'll refer to that as the "net" output. The second is the "activated" output. We'll call that "out" for brevity. I won't use the names \(H\) or \(h_i\) anymore because we actually need to be a little more specific. This section will explain how we'll refer to the hidden layer for the remainder of the writeup.
    </p>
    <p>
      You might have noticed that our equation above contained \(\phi_1\) and \(\phi_2\). This is where neural networks really get their power from. Both of these \(\phi\)s are functions too, but they are a little different from what we've seen so far because they are non-linear. We call them "activation" functions because they activate the output of the linear operations inside of them. (An important thing to note about activation functions is that they must be differentiable.)
    </p>
    <p>
      There are lots of types of activation functions. For this example, we'll use the logistic activation function \(\phi(x) = \frac{1}{1 + e^{-x}}\).
    </p>
    <p>
    We said that \(H = XW_1 + B_1\), which is true. But let's be more specific and say that \(XW_1 + B_1 = H_{net} = \begin{bmatrix}h_{net,1} & h_{net,2} & h_{net,3}\end{bmatrix}\) of net values. To this we apply the activation function to each item individually for the final out matrix of the hidden layer \(H_{out} = \begin{bmatrix}h_{out,1} & h_{out,2} & h_{out,3}\end{bmatrix} = \begin{bmatrix}\phi(h_{net,1}) & \phi(h_{net,2}) & \phi(h_{net,3})\end{bmatrix}\).
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./zoom.png' style='height:220px'/>
      <p style='width: 500px;color:#888'>\(h_{out,1}\), or the "activated" first element \(h_1\) in the hidden layer is calculated by applying the logistic activation function to \(h_{net,1}\).</p>
    </div>
    <p>
    The operation described here is to be done three times when going from the input layer \(X\) to the hidden layer \(H\), once for each \(h_i\). Referring back to the entire function \(O = \phi_2(\phi_1(XW_1 + B_1)W_2 + B_2)\), \(h_{out,1}\) ends up being the first element of \(\phi_1(XW_1 + B_1)\). Expanding the matrix operations we get \(h_{out,1} = \phi((x_1w_1 + x_2w_2) + b_{1,1})\).
    </p>
    <p>
      Likewise, \(h_{out,2} = \phi((x_1w_3 + x_2w_4) + b_{1,2})\) and \(h_{out,3} = \phi((x_1w_5 + x_2w_6) + b_{1,3})\).
    </p>
    <h5>Hidden layer to output layer</h5>
    <p>
      We want to turn the \(H_{out}\) that we just calculated into the output layer \(O\). The output layer can also be though of in two parts, \(O_{net}\) and \(O_{out}\).
    </p>
    <p>
      To get to \(O_{net}\), we similarly multiply by a weight matrix \(W_2\), which has 3 rows and 2 columns of weight parameters, and add a bias \(B_2\) to the result. Finally we apply a logistic activation function element-wise to get to our final network output, \(O_{out}\).
    </p>
    <p>
      \(O_{out}\) contains the "final output" of our function.
    </p>

    <h2>Calculating loss</h2>
    <p>
      Because the values of our parameters \(W_1\), \(W_2\), \(B_1\), and \(B_2\) were initialized randomly, the output of our function will, at first, be random as well. This is where the concept of "loss" comes in. Loss is a measure of how well a function is able to match the provided training label \(T\) for a particular data point. A label is really just another matrix, generally of the same shape as \(O_{out}\). By running both the label and output for a given training example through a loss function \(E\), we can get a numeric value that tells us how well our function performed on that data point.
    </p>
    <p>
      Let's use the squared error for this example. For an arbitrary training example with label \(T = \begin{bmatrix}t_{1} & t_{2}\end{bmatrix}\) we can calculate the squared loss as:
    </p>
    <p>
      $$E_{total}(\theta) = \sum_{i=1}^2\frac{1}{2}(t_i - o_{out,i})^2$$
    </p>
    <p>
      Notice that the error relies on \(\theta\), which is really just a placeholder for all of the parameters in the model. \(\theta\) again will be omitted in the future. Our goal is to figure out how to change all of the individual matrix values to minimize \(E_{total}\).
    </p>

    <h2>Minimizing error using gradient descent</h2>
    <p>
      Up until this point we've seen that a neural network is just a function whose output accuracy is measured by a loss function. Next, we want to train the model parameters to minimize what the loss function returns.
    </p>
    <p>
      Gradient descent is a technique that is used to update paramater weights. By taking the derivative of the total error with respect to each parameter individually, we can determine how that parameter affects the total error. Consequently, this gives us insight on how to change the weight to decrease the total error.
    <p>
      For example, to update the parameter \(w_7\), which is the edge connecting \(h_1\) and \(o_1\) above, you would perform the following update:
    </p>
    <p>
      $$w_7 := w_7 - \alpha\Big(\frac{\delta E_{total}}{\delta w_7}\Big)$$
    </p>
    <p>
      \(\alpha\) is called the "learning rate". It's just a parameter that helps determine how quickly the parameters are updated. A value too large may explode, and a value too small might take forever to converge.
    </p>
    <p>
      In the upcoming subsections, we'll work through the math required to perform updates on \(w_7\) and \(w_1\), although the same principle should be used to update all of the function's parameters.
    </p>
    <h5>Updating weight \(w_7\)</h5>
    <p>
      Let's first locate where weight \(w_7\) even is in our computational graph. In the very first image up at the top I actually don't label it, but it's the edge connecting \(h_1\) with \(o_1\). To perform the update as described, we need to determine \(\frac{\delta E_{total}}{\delta w_7}\).
    </p>
    <p>
      Breaking this down using the chain rule gives us:
    </p>
    <p>
      \(\frac{\delta E_{total}}{\delta w_7} = \frac{\delta E_{total}}{\delta o_{out,1}} \frac{\delta o_{out,1}}{\delta o_{net,1}} \frac{\delta o_{net,1}}{\delta w_7} \)
    </p>
    <p>
      You can see that each of these derivatives are stepping backwards from the error to the weight being updated, which is why this step is called backpropagation. One of the nice features of backpropagation is that it gives us modular blocks that we can recycle when we're finding gradients higher up in the graph. We'll see this when we update \(w_1\) next.
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./w7.png' style='height:220px'/>
      <p style='width: 500px;color:#888'>The error that our network currently outputs for \(o_1\) is \(\frac{1}{2}(t_1 - o_{out,1})^2\)</p>
    </div>
    <p>
      In order for us to find \(\frac{\delta E_{total}}{\delta w_7}\) let's first individually solve for each item in the chain rule decomposition.
    </p>
    <p>
      \(\frac{\delta E_{total}}{\delta o_{out,1}}\):
    </p>
    <p style="margin-left:30px">
      \(E_{total} = \frac{1}{2}(t_1 - o_{out,1})^2 + \frac{1}{2}(t_2 - o_{out,2})^2\)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta E_{total}}{\delta o_{out,1}} = -(t_1 - o_{out,1})\).
    </p>
    <p>
      \(\frac{\delta o_{out,1}}{\delta o_{net,1}}\):
    </p>
    <p style="margin-left:30px">
      \(o_{out,1} = \frac{1}{1 + e^{-o_{net,1}}}\)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta o_{out,1}}{\delta o_{net,1}} = o_{out,1}(1 - o_{out,1})\)
    </p>
    <p>
      \(\frac{\delta o_{net,1}}{\delta w_7}\):
    </p>
    <p style="margin-left:30px">
      \( o_{net,1} = w_7h_{out,1} + w_8h_{out,2} + w_9h_{out,3} + b_{2,1} \)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta o_{net,1}}{\delta w_7} = h_{out,1}\)
    </p>
    <p>
      And the complete update to \(w_7\) would be:
    </p>
    <p>
      $$w_7 := w_7 - \alpha\Big( -(o_{out,1})(h_{out,1})(t_1 - o_{out,1})(1 - o_{out,1}) \Big)$$
    </p>
    <p>
      How is this actually used in practice? After a given training example is passed through the function, the resulting values for each of these variables are then used to update \(w_7\). In an actual coded implementation, for example, the values ending up in each of these variables would be cached during forward propagation so that they could be used to calculate the gradient during backpropagation.
    </p>
    <h5>Updating weight \(w_1\)</h5>
    <p>
      Updating \(w_1\) is really similar to updating \(w_7\), the main difference being that \(w_1\) affects two components of \(E_{total}\): \(E_1\) and \(E_2\).
    </p>
    <p>
      $$ \frac{\delta E_{total}}{\delta w_1} = \frac{\delta E_{total}}{\delta h_{out,1}} \frac{\delta h_{out,1}}{\delta h_{net,1}} \frac{\delta h_{net,1}}{\delta w_1} $$
    </p>
    <p>
      $$ \frac{\delta E_{total}}{\delta w_1} = \Big( \frac{\delta E_1}{\delta h_{out,1}} + \frac{\delta E_2}{\delta h_{out,1}} \Big) \frac{\delta h_{out,1}}{\delta h_{net,1}} \frac{\delta h_{net,1}}{\delta w_1} $$
    </p>
    <p>
      We'll find each of these partial derivatives, but note that we've already done these before for the most part when we did our updates for the weights in the hidden to output layer.
    </p>
    <p>
      \(\frac{\delta E_1}{\delta h_{out,1}}\):
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta E_1}{\delta h_{out,1}} =
        \frac{\delta E_1}{\delta o_{out,1}}
        \frac{\delta o_{out,1}}{\delta o_{net,1}}
        \frac{\delta o_{net,1}}{\delta h_{out,1}}\)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta E_1}{\delta o_{out,1}} \frac{\delta o_{out,1}}{\delta o_{net,1}} = -o_{out,1}(t_1 - o_{out,1})(1 - o_{out,1})\).
    </p>
    <p style="margin-left:30px">
      \(o_{net,1} = w_7h_{out,1} + w_8h_{out,2} + w_9h_{out,3} + b_{2,1}\)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta o_{net,1}}{\delta h_{out,1}} = w_7\)
    </p>
    <p style="margin-left:30px">
      \(\frac{\delta E_1}{\delta h_{out,1}} = -w_7o_{out,1}(t_1 - o_{out,1})(1 - o_{out,1})\)
    </p>
    <p>
      \(\frac{\delta E_2}{\delta h_{out,1}} = -w_{10}o_{out,1}(t_1 - o_{out,1})(1 - o_{out,1})\)
    </p>
    <p>
      \(\frac{\delta h_{out,1}}{\delta h_{net,1}} = h_{out,1}(1 - h_{out,1})\)
    </p>
    <p>
      \(\frac{\delta h_{net,1}}{\delta w_1} = x_1\)
    </p>
    <p>
      Inserting all of these partial derivatives into the larger expression above will give us how we should update \(w_1\) for this training example.
    </p>
    <p>
      And there we have it! To see this neural network in action, you can check out the <a href="./simple_nn_from_scratch.py" download>corresponding code</a>.
    </p>
    <small>Robert Kotcher, 2019</small>
  </div>
</template>


<script>
  export default {
    name: 'Main'
  };
</script>

<style scoped>
  h2 {
    margin: 18px 0;
    line-height: 1.2;
  }

  .image-container {
    padding: 18px;
    display: flex;
    justify-content: center;
  }
</style>
