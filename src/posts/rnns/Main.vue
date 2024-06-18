<template>
  <div>
    <h1>Fun with Recurrent Neural Networks</h1>
    <p>
      Recurrent Neural Networks (RNNs) are useful for making sense of sequential data in a way that would be more difficult for a standard feed-forward neural network.
    </p>
    <p>
      The name RNN is a broad term used to describe many network implementations that exhibit temporal awareness. Some RNNs can be unrolled to look like a feedforward network due to the fact that the length of the input sequence being evaluated is finite, however the main difference here is that, in an RNN, a new piece of input data is introduced at each layer and combined with an internal state that has been passed along from previous states.
    </p>
    <p>
      Vanilla RNNs (Elman network, Jordan network, for example) have drawbacks that make them not very useful in practice, however I am going to step through two variants and use cases of the Elman network to build a foundation upon which more modern architectures can be built.
    </p>
    <h3>Simple network overview</h3>
    <p>
      It is assumed that you have some ordered sequence of data \(X\) that you want to train your network with. Examples of data types that work nicely with RNNs include, but are not limited to characters, numbers, and words in an ordered sequence. We will see both types throughout this writeup.
    </p>
    <div class='image-container' style='display:flex;flex-direction:column;align-items:center;'>
      <img src='./vanilla.png' style='height:150px'/>
      <p style='width: 500px;color:#888'>
        Figure 1: A high-level, details-omitted view of a simple RNN. For each item in sequence \(X\), \(x_t\), there is a corresponding state \(h_t\). Together, \(x_t\) and \(h_t\) can be used to determine the next state \(h_{t+1}\) and the output for that layer, \(y_t\).
      </p>
    </div>
    <p>
      We'll be iterating through the sequence, one item at a time.
    </p>
    <p>
      At step \(t\) of sequence \(X\), we want to "introduce" new information to the network that will persist through the remainder of the timesteps. We introduce the information by combining the current information (represented by \(h_t\), or the "state" at step \(t\)) with the new input \(x_t\).
    </p>
    <p>
      At time step 0 the state is usually initialized with zeros.
    </p>
    <p>
      Before choosing a particular implementation of our simple RNN, there are a few basic questions that need to be considered: What is the desired output? Are we using the network for generation or for classification? What is the dimensionality of the data we're working with?
    </p>
    <p>
      In this writeup, I'm going to put together two simple networks with the above topology, one for text generation and one for text classification, and describe how the implementation details change between the two.
    </p>
    <h2>Network 1: Echo RNN</h2>
    <p>
      In the first network we consider an  input pattern constructed from zeros and ones. When passed through the feed-forward pass of the network we wish to add a delay (or "echo") to the pattern. In effect, the network will learn to shift the input pattern by some number of timesteps. You could generate dummy data in the following way:
    </p>
<pre data-lang='python' class='prettyprint'>
def generateData():
    x = np.array(np.random.choice(2, total_series_length, p=[0.5, 0.5]))
    y = np.roll(x, DELAY_STEPS)
    y[0:DELAY_STEPS] = 0

    x = x.reshape((batch_size, -1))
    y = y.reshape((batch_size, -1))

    return (x, y)
</pre>
    <p>
      Now that we have some training data, we'll want to group it into minibatches in order to perform "minibatch gradient descent". This is worthy of another entire writeup, but putting training samples into small batches is a common training practice that, by assuming that the batch is distributed in the same way that your entire pool of training data is distributed, can speed up learning by performing the backward pass more frequently, all while decreasing the resources required.
    </p>
    <h3>Input data and placeholders</h3>
    <p>
      The graph is first initialized with three placeholders, as shown in the code sample below. batchX_placeholder accepts a tensor containing a batch of the original (no echo) sequences, batchY_placeholder accepts a tensor containing a batch of the expected output (input delayed by DELAY_STEPS timesteps), and init_state, which is the state that is passed between each timestep in the sequence.
    </p>
    <p>
      Note that "truncated_backprop_length" refers to the number of steps in the sequence that we're training the network on.
    </p>
<pre data-lang='python' class='prettyprint'>
batchX_placeholder = tf.placeholder(tf.float32, [batch_size, truncated_backprop_length])
batchY_placeholder = tf.placeholder(tf.int32, [batch_size, truncated_backprop_length])
init_state = tf.placeholder(tf.float32, [batch_size, state_size])
</pre>
    <p>
      Another way to understand these placeholders is to consider the shape and nature of the training examples that will be fed to them as they enter the network:
    </p>
    <p>
      Before building the matrices, let's create a dummy sequence of zeros and ones that we'll use to train our network:
    </p>
    <p>
      $$1 0 0 0 0 ... 0 1 0 0 0 ...$$
    </p>
    <p>
      What we'll do, although in the end the exact details of this aren't super important as they're specific to this particular case study, is break up our sequence into batches. For our example, let's create two batches of 5 consecutive items, as shown above.
    </p>
    <p>
      We could create the following batched input \(X\) to the network:
    </p>
    <div>
      $$X = \begin{bmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \end{bmatrix}$$
    </div>
    <p>
      \(X\) contains a batch of two training examples (batch size = 2), with truncated_backprop_length of 5.
    </p>
    <p>
      The corresponding "echoed" matrix \(Y\) would then look like this if, for example, DELAY_STEPS was set to 3:
    </p>
    <div>
      $$Y = \begin{bmatrix} 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 & 1 \end{bmatrix}$$
    </div>
    <p>
      Notice that we've just taken the items from \(X\) and shifted them 3 positions to the right.
    </p>
    <p>
      We finally pass in a state matrix that is initialized to all zeros, whose size is [batch_size state_size]:
    </p>
    <div>
      $$h_0 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0\end{bmatrix}$$
    </div>
    <p>
      The size of the column axis of \(h_0\) (axis = 1) might seem arbitrary, and in some ways it is. In practice, if the state is too small the network might not have the capacity to learn the nature of the training data, i.e. as the complexities of the data being learned grows, so must the available state in order to learn it. On the other hand, too much state leads to inefficiencies with storage and computation.
    </p>
    <h3>Variables</h3>
    <p>
      The variables introduced in this section will come into play throughout the remainder of this section of the writeup - I'm just presenting them now for reference. The values that they receive upon initialization is less important because these are the values that will be learned during training. I'll talk more about their dimensionality as we go.
    </p>
<pre data-lang='python' class='prettyprint'>
W = tf.Variable(np.random.rand(state_size+1, state_size), dtype=tf.float32)
b = tf.Variable(np.zeros((1,state_size)), dtype=tf.float32)

W2 = tf.Variable(np.random.rand(state_size, num_classes),dtype=tf.float32)
b2 = tf.Variable(np.zeros((1,num_classes)), dtype=tf.float32)
</pre>
    <h3>Network architecture</h3>
    <p>
      This is a nice transition into the remainder of the computational graph, which combines these three placeholders to compute both the predicted output as well as loss. As before, let's start with the relevant code.
    </p>
<pre data-lang='python' class='prettyprint'>
inputs_series = tf.unstack(batchX_placeholder, axis=1)
labels_series = tf.unstack(batchY_placeholder, axis=1)

current_state = init_state
states_series = []
for current_input in inputs_series:
    current_input = tf.reshape(current_input, [batch_size, 1])
    input_and_state_concatenated = tf.concat([current_input, current_state], 1)

    next_state = tf.tanh(tf.matmul(input_and_state_concatenated, W) + b)
    states_series.append(next_state)
    current_state = next_state
</pre>
    <p>
      For both the input (batchX_placeholder) and corresponding labels (batchY_placeholder), we split on the column and end with a list of tensors, each of size [batch_size 1]. In our dummy example, inputs_series would look like:
    <p>
    <div>
      $$[\begin{bmatrix} 1 \\ 0 \end{bmatrix}, \begin{bmatrix} 0 \\ 1 \end{bmatrix}, ...]$$
    </div>
    <p>
      At each iteration of the loop, we combine the input with the most up-to-date state value, of size [batch_size, state_size]. For example, on the first iteration, we end up with:
    </p>
    <div>
      $$\mathrm{input\_and\_state\_concatenated = concat([x\_0, h\_0], axis=1)} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0\end{bmatrix}$$
    </div>
    <p>
      We then transition to the next state by matrix multiplying with \(W\). We must choose \(W\) in such a way that we again end up with a state matrix of shape [batch_size, state_size]. In other words, we want to find a shape [A, B] for \(W\) such that:
    </p>
    <div>
      $$[batch\_size, state\_size + 1] @ [A, B] = [batch\_size, state\_size]$$
    </div>
    <v-alert
      icon="mdi-help"
      prominent
      text
      type="info"
    >
      <p>
        Lately I've been using "@" to mean "matrix multiply" because <strong>Since python >= 3.5 the @ operator is supported (see PEP 465). In TensorFlow, it simply calls the tf.matmul() function...</strong>
      </p>
    </v-alert>

    <p>
      It's clear that \(W\) should be of shape [state_size + 1, state_size], and that exactly what is done (see "Variables" above).
    </p>
    <h3>Output layer</h3>
    <p>
      After iterating through all of the input values in input_series, we end up with truncated_backprop_length state matrices. Each of these matrices is then multiplied by \(W_2\). The purpose of \(W_2\) is to take the shape down to [batch_size, 2]. The same \(W_2\) is used for each multiplication within a batch.
    </p>

<pre data-lang='python' class='prettyprint'>
logits_series = [tf.matmul(state, W2) + b2 for state in states_series]

predictions_series = [tf.nn.softmax(logits) for logits in logits_series]

losses = [tf.nn.sparse_softmax_cross_entropy_with_logits(logits=logits, labels=labels) for logits, labels in zip(logits_series,labels_series)]

total_loss = tf.reduce_mean(losses)
</pre>

    <p>
      We end up with a truncated_backprop_length logits (weights that are intended to be converted to probabilities) of the following size:
    </p>
    <div>
      $$[ [batch\_size, num\_classes], ...]$$
    </div>
    <p>
      After running each of the logits through a softmax, we end up with a series of probabilities, where the matrix at \(i\) gives the probability of each output per class, per batch index. So, using the \(X\) we defined with dummy data above, we might end up with the following predication_series:
    </p>
    <div>
$$
[ \left[ \begin{array}{cc}
0.5 & 0.5 \\
0.5 & 0.5
\end{array} \right]
,
\left[ \begin{array}{cc}
0.5 & 0.5 \\
0.5 & 0.5
\end{array} \right]
,
\left[ \begin{array}{cc}
0.5 & 0.5 \\
0.5 & 0.5
\end{array} \right]
,
\left[ \begin{array}{cc}
0.1 & 0.9 \\
0.9 & 0.1
\end{array} \right]
,
\left[ \begin{array}{cc}
0.9 & 0.1 \\
0.1 & 0.9
\end{array} \right]
]
$$
    </div>
    <p>
      To interpret this dummy output, the network expects that for the first batch the output at the 4th index is most likely to be a 1, followed by a 0. Conversely, for the second item in the batch, the 4th and 5th item in the sequence is expected to be a 0 followed by a 1.
    </p>
    <p>
      We could use these predictions to compute the loss ourselves, but since this is such a common series of operations, Tensorflow provides a function sparse_softmax_cross_entropy_with_logits, which basically takes the logits, computes the softmax over it, and then finds the cross-entropy loss. See the note on cross-entropy below.
    </p>

    <v-alert
      icon="mdi-help"
      prominent
      text
      type="info"
    >
      <p>
        <strong>Cross-Entropy</strong> measures the performance of a classification model whose output is a probability value between 0 and 1. Loss increase the further away the predicted label is from the true label.
      </p>
      <p>
        $$H(p,q) = -\sum_{i \in C} p(i) log q(i)$$
      </p>
      <p>
        where \(p(i)\) is the true class label for the \(i^{th}\) training example, \(q(i)\) is the predicted probability, and C is the number of classes.
      </p>
      <p>
        What this means is, for each training example, we only take into consideratihow close the probability of the true class is to 1. That means we can simplify to \(H(p,q) = -log(q(i))\).
      </p>
    </v-alert>

    <p>
      The built-in function sparse_softmax_cross_entropy_with_logits will give us a per-batch index, per-sequence step loss. For example,
    </p>
    <div>
      $$[\begin{bmatrix} 0.84 \\ 0.75 \end{bmatrix}, \begin{bmatrix} 0.75 \\ 0.8 \end{bmatrix}, ...]$$
    </div>
    <p>
      To find a single loss value, we find the mean across all axis, but may not be the only way to do so.
    </p>
    <h2>Network 2: Classification network</h2>
    <p>
      We have just seen a network that produces N outputs for N inputs. This network is great when translating one sequence to another, but dosen't really make sense for the use case where a sequence is being classified because the output is non-sequential.
    </p>
    <p>
      I decided to take the Echo RNN and modify it to accept sequential data and output a one-hot vector containing a 1 in the position representing the class label. The particular use case that I had in mind was a language detector, however in the end I could have equivalently been measuring anything - it really depends on how you decide to label your training data.
    </p>
    <p>
      The architectural differences between this network and the Echo RNN actually ended up being subtle, but I did run into some unrelated challenges when it came to dealing with batch data and 1-hot encoded data, which I touch on briefly below.
    </p>
    <h3>Classification network architecture</h3>
    <p>
      Recall how we maintain a states_series variable while looping over input_series in the Echo RNN from section 1. In the classification network, this is no longer necessary because our output is non-sequential (i.e. has a different shape) and information is passed across all timesteps. We can just pass the final state \(h\) to a "dense layer" to reduce its dimensionality.
    </p>
    <p>
      It's probably easiest to show the code for this in its entirety, and then after discuss the points of interest.
    </p>
<pre data-lang='python' class='prettyprint'>
batchX_placeholder = tf.placeholder(tf.float32,
    [batch_size, truncated_backprop_length, encoding_size])
batchY_placeholder = tf.placeholder(tf.int32,
    [batch_size, num_classes])

init_state = tf.placeholder(tf.float32, [batch_size, state_size, 1])

Wxh = tf.Variable(np.random.rand(batch_size, state_size, encoding_size), dtype=tf.float32)
bh = tf.Variable(np.zeros((batch_size, state_size, 1)), dtype=tf.float32)

Whh = tf.Variable(np.random.rand(batch_size, state_size, state_size), dtype=tf.float32)

Why = tf.Variable(np.random.rand(batch_size, num_classes, state_size), dtype=tf.float32)
by = tf.Variable(np.zeros((batch_size, num_classes, 1)), dtype=tf.float32)

inputs_series = tf.unstack(batchX_placeholder, axis=1)

h = init_state
for x in inputs_series:
    x = tf.reshape(x, [batch_size, encoding_size, 1])
    h = tf.tanh(tf.matmul(Wxh, x) + tf.matmul(Whh, h) + bh)

y_logits = tf.tanh(tf.matmul(Why, h) + by)
y_logits = tf.reshape(y_logits, [batch_size, num_classes])
</pre>
    <p>
      One challenge I ran into when dealing with text data was dealing with the extra dimension of encoding. In our Echo RNN, we were fortunate that our input data consisted of just 0s and 1s.
    </p>
    <p>
      When dealing with text data however, you end up needing to encode each input with 1-hot vectors (or <a target="_blank" href="https://en.wikipedia.org/wiki/Word_embedding">word embeddings</a>).
    </p>
    <p>
      Dealing with batches and one-hot data at the same time ended up being more straightforward than I thought it would be. It turns out that, although you can't matrix multiply a tensor with anything other than 2 dimensions, matrix multiplication in both Tensorflow and numpy only require that the inner two dimensions are compatible.
    </p>
    <p>
      For example, multiplying matrices with shapes [3, 4, 5] and [3, 5, 4] will result in a matrix with a shape of [3, 4, 4]. Matrix multiplying in this case would result in 3 matrix multiplies, one for each of the 3 inputs in the batch.
    </p>
    <h2>The vanishing gradient</h2>
    <p>
      In the end, vanilla RNNs aren't really used in practice. The reason is that backpropagation across so many layers makes it difficult for the network to learn because the gradients become "vanishingly" small.
    </p>
    <p>
      Common solutions to the vanishing gradient problem include using LSTM or GRU networks, and I'll have to wait for another day to do a writeup on these ones.
    </p>
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
