<template>
  <div>
    <h1>Deep CryptoKitties</h1>
    <p>
      Back when Ethereum was popular I wanted to own a <a target='_blank' href="https://www.cryptokitties.co/about">CryptoKitty</a> like all of the cool kids did. I remember spending about $30 on a completely unique, second generation CryptoKitty, and enjoying that for about 5 minutes before completely forgetting about it.
    </p>
    <div class="image-container">
      <img class="cryptokitty" src='./cryptokitty.png'/>
      <small>My 2nd generation CryptoKitty</small>
    </div>
    <p>
      For those who are unfamiliar with the project, a CryptoKitty is essentially a blockchain-based game where users can breed CryptoKitties that they own to unlock new traits. It comes with the whole proof-of-ownership guarantee that blockchains provide, but that's a whole different discussion.
    </p>
    <p>
      In this post, I resurrect my interest in CryptoKitties. The objective here is to build a general adversarial network (GAN) to learn what a CryptoKitty is and generate new and unique creatures by studying existing ones.
    </p>

    <h2>
      Data creation
    </h2>
    <p>
      As this was the first time I had ever built a GAN, I decided to simplify the input data to a level I thought would be reasonably challenging without risking not having enough memory/compute power/knowledge to get results worth posting about.
    </p>
    <p>
      A quick check of the <a href='https://cryptokitties.co'>cryptokitties.co</a>source code revealed that I'd be able to fetch images by querying <a href='https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1831008.svg'>https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1831008.svg</a>, and replacing the image name (1831008.svg) with randomly-generated numbers.
    </p>
    <p>
      Because the images were SVG, I had to use a command-line tool to both convert to PNG and select a fixed size. Not knowing the scale by which adding a few more pixels would increase memory/compute requirements, I decided to be conservative and set each image at 200x200.
    </p>
    <p>
      Finally I reduced the number of channels from 3 to 1.
    </p>

    <h2>
      GAN overview
    </h2>
    <p>
      At a high level, a GAN consists of two deep neural networks that are being optimized at the same time:
    </p>
    <ul>
      <li>
        The <strong>generator</strong> tries to create output that matches the distribution of the training data, given some arbitrary input. In this example, out input data is random and normally distributed.
      </li>
      <li>
        The <strong>discriminator</strong> tries to determine whether or not an input image is real or fake.
      </li>
    </ul>
    <br/>
    <p>
      The following code snippet is the final version of my <strong>generator</strong>:
    </p>
<pre data-lang='python' class='prettyprint'>
def make_generator_model():
    model = tf.keras.Sequential()
    model.add(layers.Dense(25*25*400, use_bias=False, input_shape=(1500,)))
    model.add(layers.BatchNormalization())
    model.add(layers.LeakyReLU())

    model.add(layers.Reshape((25, 25, 400)))
    assert model.output_shape == (None, 25, 25, 400) # Note: None is the batch size

    model.add(layers.Conv2DTranspose(100, (5, 5), strides=(2, 2), padding='same', use_bias=True))
    assert model.output_shape == (None, 50, 50, 100)
    model.add(layers.BatchNormalization())
    model.add(layers.LeakyReLU())

    model.add(layers.Conv2DTranspose(50, (5, 5), strides=(2, 2), padding='same', use_bias=True))
    assert model.output_shape == (None, 100, 100, 50)
    model.add(layers.BatchNormalization())
    model.add(layers.LeakyReLU())

    model.add(layers.Conv2DTranspose(1, (5, 5), strides=(2, 2), padding='same', use_bias=True))
    assert model.output_shape == (None, 200, 200, 1)
    model.add(layers.BatchNormalization())
    model.add(layers.LeakyReLU())

    return model
</pre>
    <p>
      What's happening here is that this network takes as input a batch of training data that has shape [None, 1500]. Remember that this data is normally distributed, and the generator's goal is to learn how to redistribute the data so that it matches the distribution of the training data.
    </p>
    <p>
      Something that I wanted to point out is that the Conv2DTranspose "spreads" the data from a lower to a higher dimensionality, which is how we're able to go from a shape of (25, 25, 400) to a shape of (50, 50, 100). This operation is sometimes misleadingly referred to as a "deconvolution". Notice how the strides actually multiply the length and width of each layer, rather than dividing.
    </p>

    <p>
      The following code snippet is the final version of my <strong>discriminator</strong>:
    </p>
<pre data-lang='python' class='prettyprint'>
def make_discriminator_model():
    model = tf.keras.Sequential()

    # 64 because 64 filters were used, 100 bc stride was 2
    # From docs: if Conv2D is the first layer of the network, the sample axis
    # should not be included in "input_shape"
    model.add(layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same',
                                     input_shape=[200, 200, 1]))
    assert model.output_shape == (None, 100, 100, 64)
    model.add(layers.LeakyReLU())
    model.add(layers.Dropout(0.1))

    model.add(layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same'))
    assert model.output_shape == (None, 50, 50, 128)
    model.add(layers.LeakyReLU())
    model.add(layers.Dropout(0.1))

    model.add(layers.Conv2D(256, (5, 5), strides=(2, 2), padding='same'))
    assert model.output_shape == (None, 25, 25, 256)
    model.add(layers.LeakyReLU())
    model.add(layers.Dropout(0.1))

    model.add(layers.Flatten())
    model.add(layers.Dense(1))

    return model
</pre>

    <p>
      The discriminator is composed of more standard convolution, activation, and normalization layers. The objective on the discriminator is, given an image, to determine whether it is real or fake.
    </p>
    <p>
      As I monitored the loss of this network during training I found that it was almost always monotonically decreasing, therefore I found myself spending much less time tweaking the hyperparameters of this network.
    </p>
    <p>
      Speaking of loss functions - here are the loss functions:
    </p>

<pre data-lang='python' class='prettyprint'>
def discriminator_loss(real_output, fake_output):
    real_loss = cross_entropy(tf.ones_like(real_output), real_output)
    fake_loss = cross_entropy(tf.zeros_like(fake_output), fake_output)
    total_loss = real_loss + fake_loss
    return total_loss

def generator_loss(fake_output):
    return cross_entropy(tf.ones_like(fake_output), fake_output)
</pre>
    <p>
      We know the discriminator did well if <strong>real_output</strong> is all ones and <strong>fake_output</strong> is all zeros, i.e., it is able to correctly determine which images are real and which are fake.
    </p>
    <p>
      We know the generator did well if it was able to trick the discriminator, which equates to the discriminator assigning a higher value for a fake input.
    </p>

    <h2>Results</h2>
    <p>
      At first, both networks perform randomly. For example, here is the generator's output from a number of different runs, prior to the first epoch of training.
    </p>
    <div class="image-container">
      <div class="image-container-row">
        <img class="example-image" src="./random-1.png"/>
        <img class="example-image" src="./random-2.png"/>
      </div>
      <small>Normally distributed random data across two runs</small>
    </div>
    <p>
      I was trying to think of the most insightful way to group and describe images that were generated during various training attempts. There are so many variants of each network (depth, dimensionality, activation, bias, dropout, etc) that I ran that it quickly became an overwhelming task to organize them in an informative and fun way - so I now give to you some generator outputs in no particular order:
    </p>
    <div class="image-container">
      <div class="image-container-row">
        <img class="example-image" src="./gen-1.png"/>
        <img class="example-image" src="./gen-2.png"/>
        <img class="example-image" src="./gen-3.png"/>
        <img class="example-image" src="./gen-4.png"/>
      </div>
      <small>Examples of generator output during training</small>
    </div>
    <p>
      A key breakthrough that I made was that, although increasing the depth and dimensionality of the generator network itself did change the its accuracy, the single most impactful change I made was to increase the dimensionality of the input data. In my final and most successful run, where each training sample had 1500 normally-distributed numbers, I was able to achieve the following results:
    </p>
    <div class="image-container">
      <div class="image-container-row">
        <img class="example-image" src="./final-1.png"/>
        <img class="example-image" src="./final-2.png"/>
        <img class="example-image" src="./final-3.png"/>
        <img class="example-image" src="./final-4.png"/>
      </div>
      <small>
        Although the input data is random, I was able to increase output quality significantly just by increasing its dimensionality.
      </small>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main'
  };
</script>

<style scoped>
  pre {
    padding: 0;
    background-color: #333;
    font-size: 10px;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 18px 0;
  }

  .cryptokitty {
    width: 220px;
    object-fit: contain;
  }

  .example-image {
    width: 130px;
    height: 130px;
    margin: 12px;
  }
</style>
