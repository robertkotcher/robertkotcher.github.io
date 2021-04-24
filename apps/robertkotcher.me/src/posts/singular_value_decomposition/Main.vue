<template>
  <div>
    <h1>Singular Value Decomposition: Two Perspectives</h1>
    <p>
      The equality \(A = U \Sigma V^{T}\) is one of most important in linear algebra. In this essay, I want to make SVD a little more intuitive. I'll try to do so with examples, visualizations, and the corresponding math for completeness.
    </p>
    <p>
      I'll look at SVD in the following contexts:
    </p>
    <ol>
      <li>Approximating a rank r matrix with a rank k matrix.</li>
      <li>Understanding the relationships between the four fundamental subspaces.</li>
    </ol>
    <h2>1. Approximating a rank r matrix with a rank k matrix</h2>
    <p>
      In the first perspective a matrix of rank r is broken down into a set of rank 1 matrices.
    </p>
    <p>
      To solve \(A = U \Sigma V^{T}\) we split the problem into two parts, solving for \(U\) in the first and \(V\) in the second, by diagonalizing \(AA^{T}\) and \(A^{T}A\). In both cases, we're diagonalizing a positive semidefinite matrix, and we end up with two equivalent orthonormal matrices of eigenvectors and one eigenvalue matrix. For example, finding the columns of \(V\) would involve the following:
    </p>
    <p>
      $$A^{T}A = V \Sigma^{T} U^{T} U \Sigma V^{T} = V \Sigma^2 V^{T}$$
    </p>
    <p>
      What does this really mean? Because \(V \Sigma^2 V^{T}\) diagonalizes \(A^{T}A\), each element \(v_i\) is an eigenvector. Similarly, each \(u_i\) is an eigenvector of \(AA^{T}\). Suppose \(A\) is rank r. Then the following are true:
    </p>
    <ol>
      <li>\(v_1 \cdots v_r\) form an orthonormal basis.</li>
      <li>\(u_1 \cdots u_r\) form an orthonormal basis.</li>
      <li>\(r\) is equal to the number of non-zero diagonal values of \(\Sigma\).</li>
    </ol>
    <p>
      All vectors of \(V\) and \(U\) beyond the first r comprise the nullspace, and their corresponding diagonal entries in \(\Sigma\) are zero.
    </p>
    <p>
      We can express A as a sum of r rank 1 matrices, each the outer product of a left singular vector, it's singular value, and the corresponding right singular vector:
    </p>
    <p>$$A = \sum_{i=1}^{r} \sigma_i u_i v_i^T$$</p>
    <p>Suppose we start with the following image matrix A:</p>
    <div class='image-container'>
      <img src='./panama.jpg'/>
    </div>
    <p>
      If I run SVD on A, and set all of the items on the diagonal of \(\Sigma\) to 0 except for the most significant \(\sigma_1\), and then render the resulting recombination, I end up with the following:
    </p>
    <div class='image-container'>
      <img src='./panama-1.png'/>
    </div>
    <p>
      In this first matrix, each row is really just the combination of the first left singular vector, the first singular value, and the first right singular vector: \(A' = \sigma_1 u_1 v_1^T\).
    </p>
    <p>
      Taking a look at the first 10 rank 1 matricies gives us:
    </p>
    <div class='image-container'>
      <img src='./panama-10.png'/>
    </div>
    <p>
      We can now start to see many of the features of the original image! Each singular vector of \(U\) and \(V\) encodes information from the original matrix \(A\).
    </p>

    <h2>2. Understanding the relationships between the four fundamental subspaces</h2>

    <p>
      Let's instead look at \(A\) as a function from \(R^n \rightarrow R^m\). Because \(U\) is orthogonal with sides of length m and \(V\) is orthogonal with sides of length n, we can represent any \(x\) as \(Vc\), where \(c\) describes how to make \(x\) out of basis \(V\).
    </p>
    <p>
      Looking at \(A\) in this way, we can write \(Ax = U \Sigma V^T Vc = U \Sigma c\):
    </p>
    <div class='image-container'>
      <img src='./functionA.png'/>
    </div>
    <p>
      So \(x = Vc\) and \(Ax = U \Sigma c\). The input, a vector in \(R^n\), is transformed to \(R^m\) via the function that is \(A\).
    </p>
    <p>
      The number of non-zero values in \(c\) is equal to the rank of both \(A\) and \(A^T\). When calculating the output \(Ax\), the remaining \(m-r\) zero entries in \(c\) will cancel out the last \(m-r\) columns of \(U\).
    </p>
    <p>
      Most importantly, this brings to light the four fundamental subspaces that are players in the \(Ax\) operation:
    </p>
    <ol>
      <li>The <strong>nullspace of \(A^T\)</strong> is a subspace of \(R^m\) that is "unreachable" during the operation \(Ax\). It's the last \(m-r\) columns of \(U\) in our SVD and can never be reached because \(\Sigma c \in R^m\), and the \(r-m\) final vector positions are zeros.</li>
      <li>The <strong>nullspace of \(A\)</strong> is a subspace of \(R^n\). Similarly here, changes in this subspace don't matter because they'll ultimately be killed by the zero entries of \(\Sigma\). We'll call this the "doesn't matter" space.</li>
      <li>The <strong>columnspace of A</strong> is a subspace of \(R^m\). In the SVD view, the column space is the part of \(U\) that can actually be manipulated, i.e., the "reachable space".</li>
      <li>The <strong>rowspace of A</strong> is a subspace of \(R^n\), and is the part of \(x\) that will affect the output \(Ax\). It's the "matters" space.</li>
    </ol>

    <p>To sum up this perspective, SVD can be used as a tool to illustrate the fundamental subspaces of \(A\). When \(A\) is viewed as a function, it can help us to understand what changes in the input will make an inpact on the output \(Ax\).</p>

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
