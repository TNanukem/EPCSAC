# Contribution Guide
Thank you for your interest in contributing to the EPCSAC project. Contributions are encouraged and desired, however, to maintain control over the modifications and be sure that every new feature added does not break the system, some guidelines need to be followed. Read this file if you want to help us with the development of the project.

## Ways of contributing

1. Requesting features
2. Implementing new features 
3. Reporting bugs
4. Correcting bugs
5. Improving the documentation
6. Improving the quality of the code

All of these ways of contributing have in common steps.

## Contributing

### Issues
Most of the times, a contribution will start with an issue. If you are proposing a new feature, or reporting a bug for an existing issue, please leave a comment on the issue to let others know that you're working on that, so we can avoid rework. If your feature or bug does not have an issue yet, please, open an issue reporting it and saying that you will be working on that.

Improvements made to the documentation and on code quality may not require an issue to be accepted. However, I advise you to open an issue anyway so we can keep things organized. This will probably accelerate the acceptance of your change.

### Forks and Commits
All new changes must be done in a separate branch, created from the dev branch, on a fork of the main project on your local machine. Please, do not try to make changes directly on the master or the production branches, cause they will not be accepted. 

We use the dev branch as the main source of new features. After all of them are tested and approved, the dev will be merged into the master, and only when possible, it will be put in production on the production branch. To create a new branch for your feature, do: `git checkout dev -b my_contribution`. 

When opening a pull request to merge your modifications into dev, please comment on the PR which issue your code refers to. Please, do one PR per issue and only one modification per branch. Correcting and testing several changes on a single batch makes the process slower and more prone to errors.

#### Branch name convention
The project follows the convention for branch names:
- A new feature: `feature_name_of_feature`
- A bug fix: `bugfix_#issue_number`
- Improvement for code and documentation: `improvement_#issue_number`

## Other ways of contributing
Other ways to contribute to the project without working on the documentation or the source-code are:
- Use our platform on your publications and then citing us on that.
- Giving the repo a start.
- Talking about the project to your colleagues.
- Sharing it on social media.

---

In case of questions, please send an e-mail to TNanukem.
