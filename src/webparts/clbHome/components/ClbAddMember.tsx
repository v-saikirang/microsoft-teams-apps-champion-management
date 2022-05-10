import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import {
  ISPHttpClientOptions, SPHttpClient,
  SPHttpClientResponse
} from "@microsoft/sp-http";
import { sp } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import {
  PeoplePicker,
  PrincipalType
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as LocaleStrings from 'ClbHomeWebPartStrings';
import { Dropdown, IDropdownStyles } from "office-ui-fabric-react/lib/Dropdown";
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import siteconfig from "../config/siteconfig.json";
import styles from "../scss/CMPAddMember.module.scss";



export interface IClbAddMemberProps {
  context?: any;
  onClickCancel: () => void;
  onClickBack: () => void;
  onClickSave: (userStatus: string) => void;
  siteUrl: string;
  isAdmin: boolean;
}
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
  FirstName: string;
  LastName: string;
  Country: String;
  Status: String;
  Role: String;
  Region: string;
  Points: number;
}
interface IUserDetail {
  ID: number;
  LoginName: string;
  Name: string;
}
interface IState {
  list: ISPLists;
  isAddChampion: boolean;
  errorMessage: string;
  updatedMessage: string;
  UserDetails: Array<any>;
  selectedusers: Array<any>;
  siteUrl: string;
  regionDropdown: Array<any>;
  allUser: Array<any>;
  coutries: Array<any>;
  regions: Array<any>;
  users: Array<any>;
  roles: Array<any>;
  status: Array<any>;
  groups: Array<any>;
  focusAreas: Array<any>;
  memberData: any;
  memberrole: string;
  sitename: string;
  inclusionpath: string;
  load: boolean;
}

const classes = mergeStyleSets({
  cancelIcon: {
    marginRight: "10px",
    fontSize: "17px",
    fontWeight: "bolder",
    color: "#000003",
    opacity: 1
  },
  saveIcon: {
    marginRight: "10px",
    fontSize: "17px",
    fontWeight: "bolder",
    color: "#FFFFFF",
    opacity: 1
  }
});

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: "auto",
    margin: "1rem 0rem 1rem 0rem"
  },
  dropdownItem: {
    backgroundColor: "#F6F5F4",
    border: "0.25px solid #979593",
    padding: "0%",
    selectors: {
      ":hover": {
        border: "1px solid #1e90ff",
      }
    },
    textAlign: "left",
    font: "normal normal normal 16px/21px",
    fontFamily: "Segoe UI",
    letterSpacing: "0px",
    color: "#000000",
    opacity: 1
  },
  dropdownOptionText: {
    paddingLeft: "26px",
    paddingTop: "5px"
  },
  dropdownItemSelected: {
    border: "0.25px solid #979593",
    paddingLeft: "0px",
    paddingTop: "5px",
  },
  title: {
    paddingLeft: "26px",
    paddingTop: "3px",
    font: "normal normal 400 18px/24px Segoe UI",
    textAlign: "left",
    letterSpacing: "0px",
    color: "#000000",
    opacity: 1,
    borderColor: "#DEDEF3",
    backgroundColor: "#DEDEF3"
  },
};

class ClbAddMember extends React.Component<IClbAddMemberProps, IState> {
  public addMemberPeoplePickerParentRef: React.RefObject<HTMLDivElement>;
  public addMemberPeoplePickerRef: React.RefObject<PeoplePicker>;
  constructor(props: IClbAddMemberProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context,
    });
    this.addMemberPeoplePickerParentRef = React.createRef();
    this.addMemberPeoplePickerRef = React.createRef();
    this.state = {
      list: { value: [] },
      isAddChampion: false,
      errorMessage: "",
      updatedMessage: "",
      UserDetails: [],
      selectedusers: [],
      regionDropdown: [],
      allUser: [],
      coutries: [],
      regions: [],
      users: [],
      roles: [],
      status: [],
      groups: [],
      focusAreas: [],
      memberData: { region: "", group: "", focusArea: "", country: "" },
      siteUrl: this.props.siteUrl,
      memberrole: "",
      sitename: siteconfig.sitename,
      inclusionpath: siteconfig.inclusionPath,
      load: false
    };

    this.updatePeoplePickerMenuAttributes = this.updatePeoplePickerMenuAttributes.bind(this);
    this.removeButtonEvent = this.removeButtonEvent.bind(this);
  }

  public componentDidMount() {
    this.props.context.spHttpClient
      .get(

        "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/fields/GetByInternalNameOrTitle('Region')",
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((regions) => {
          if (!regions.error) {
            this.props.context.spHttpClient
              .get(

                "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/fields/GetByInternalNameOrTitle('Country')",
                SPHttpClient.configurations.v1
              )
              // tslint:disable-next-line: no-shadowed-variable
              .then((response: SPHttpClientResponse) => {
                response.json().then((coutries) => {
                  if (!coutries.error) {
                    this.setState({
                      regions: regions.Choices,
                      coutries: coutries.Choices,
                    });
                  }
                });
              });
          }
        });
      });

    this.props.context.spHttpClient
      .get(

        "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/fields/GetByInternalNameOrTitle('Group')",
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((groups) => {
          if (!groups.error) {
            this.props.context.spHttpClient
              .get(

                "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/fields/GetByInternalNameOrTitle('FocusArea')",
                SPHttpClient.configurations.v1
              )
              // tslint:disable-next-line: no-shadowed-variable
              .then((response: SPHttpClientResponse) => {
                response.json().then((focusAreas) => {
                  if (!focusAreas.error) {
                    this.setState({
                      groups: groups.Choices,
                      focusAreas: focusAreas.Choices,
                    });
                  }
                });
              });
          }
        });
      });

    //Update Aria Label attribute to people picker control
    const peoplePickerElement = this.addMemberPeoplePickerParentRef.current.getElementsByClassName('ms-FocusZone');
    const peoplePickerAriaLabel = this.props.isAdmin ? LocaleStrings.AddMemberPageTitle : LocaleStrings.NominateMemberPageTitle;
    peoplePickerElement[0].setAttribute('aria-label', peoplePickerAriaLabel);

    this.updatePeoplePickerMenuAttributes();
  }

  //Update Aria Label attribute to people picker control's suggestions Menu
  private updatePeoplePickerMenuAttributes = () => {
    const inputElement = this.addMemberPeoplePickerParentRef.current.getElementsByTagName('input')[0];

    inputElement.onchange = () => {
      const peopleSuggestions = document.getElementsByClassName('ms-Suggestions-itemButton');

      if (this.addMemberPeoplePickerRef.current.state.mostRecentlyUsedPersons.length > 0 && peopleSuggestions.length > 0) {
        const peoplePickerMenu = document.getElementsByClassName('ms-Suggestions-container')[0];
        peoplePickerMenu.setAttribute("aria-label", this.addMemberPeoplePickerRef.current.props.placeholder);
      }
    };

    const inputEvent = () => {
      setTimeout(() => {
        const peoplePicker = this.addMemberPeoplePickerParentRef.current.getElementsByClassName('ms-FocusZone');
        const peopleSuggestions = document.getElementsByClassName('ms-Suggestions-itemButton');
        if (peoplePicker[0].getAttribute('aria-expanded') === "true" && this.addMemberPeoplePickerRef.current.state.mostRecentlyUsedPersons.length > 0 && peopleSuggestions.length > 0) {
          const peoplePickerMenu = document.getElementsByClassName('ms-Suggestions-container')[0];
          peoplePickerMenu.setAttribute("aria-label", this.addMemberPeoplePickerRef.current.props.placeholder);
        }
      }, 1000);
    };

    inputElement.onclick = inputEvent;
    inputElement.onfocus = inputEvent;

  }

  //onclick event to the people remove button
  private removeButtonEvent = () => {
    if (this.state.UserDetails.length > 0) {
      const removeBtn = this.addMemberPeoplePickerParentRef.current.getElementsByClassName('ms-PickerItem-removeButton')[0];
      if (removeBtn !== undefined) {
        removeBtn.addEventListener('click', () => {
          setTimeout(() => {
            const peoplePicker = this.addMemberPeoplePickerParentRef.current.getElementsByClassName('ms-FocusZone');
            const peopleSuggestions = document.getElementsByClassName('ms-Suggestions-itemButton');
            if (peoplePicker[0].getAttribute('aria-expanded') === "true" && this.addMemberPeoplePickerRef.current.state.mostRecentlyUsedPersons.length > 0 && peopleSuggestions.length > 0) {
              const peoplePickerMenu = document.getElementsByClassName('ms-Suggestions-container')[0];
              peoplePickerMenu.setAttribute("aria-label", this.addMemberPeoplePickerRef.current.props.placeholder);
            }
            this.updatePeoplePickerMenuAttributes();
          }, 1000);
        });
      }
    }
  }

  public componentDidUpdate(prevProps: Readonly<IClbAddMemberProps>, prevState: Readonly<IState>, snapshot?: any): void {
    //Update aria label to suggestions menu when people picker control re-renders on selection
    if (prevState.UserDetails.length !== this.state.UserDetails.length) {
      this.removeButtonEvent();
    }
  }

  
  private _getPeoplePickerItems(items: any[]) {
    let userarr: IUserDetail[] = [];
    items.forEach((user) => {
      userarr.push({ ID: user.id, LoginName: user.loginName, Name: user.text });
    });
    this.setState({ UserDetails: userarr });
  }

  private async _getListData(email: any): Promise<any> {
    return this.props.context.spHttpClient
      .get(
        "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/Items?$filter=Title eq '" + email.toLowerCase() + "'",
        SPHttpClient.configurations.v1
      )
      .then(async (response: SPHttpClientResponse) => {
        if (response.status === 200) {
          let flag = 0;
          await response.json().then((responseJSON: any) => {
            let i = 0;
            while (i < responseJSON.value.length) {
              if (
                responseJSON.value[i] &&
                responseJSON.value[i].hasOwnProperty("Title")
              ) {
                if (
                  responseJSON.value[i].Title.toLowerCase() ==
                  email.toLowerCase()
                ) {
                  flag = 1;
                  return flag;
                }
              }
              i++;
            }
            return flag;
          });
          return flag;
        }
      });
  }

  //Add person to the Member List
  public async _createorupdateItem() {
    return this.props.context.spHttpClient
      .get(

        "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
        SPHttpClient.configurations.v1
      )
      .then((responseuser: SPHttpClientResponse) => {
        responseuser.json().then((datauser: any) => {
          if (!datauser.error) {
            this.props.context.spHttpClient
              .get(

                "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/Items",
                SPHttpClient.configurations.v1
              )
              .then((responsen: SPHttpClientResponse) => {
                responsen.json().then((datada) => {
                  let memberDataId = datada.value.find(
                    (d: { Title: string }) =>
                      d.Title.toLowerCase() === datauser.Email.toLowerCase()
                  );
                  let memberidData =
                    memberDataId !== undefined
                      ? memberDataId.Role.toLowerCase()
                      : "User";
                  this.setState({ memberrole: memberidData });
                  if (this.state.UserDetails.length > 0) {
                    let email = this.state.UserDetails[0].ID.split("|")[2];
                    // tslint:disable-next-line: no-shadowed-variable
                    this.props.context.spHttpClient
                      .get("/" + this.state.inclusionpath + "/" + this.state.sitename +
                        "/_api/web/siteusers",
                        SPHttpClient.configurations.v1
                      )
                      .then((responseData: SPHttpClientResponse) => {
                        if (responseData.status === 200) {
                          responseData.json().then(async (data) => {
                            // tslint:disable-next-line: no-function-expression
                            var member: any = [];
                            data.value.forEach(element => {
                              if (element.Email.toLowerCase() === email.toLowerCase())
                                member.push(element);
                            });

                            const listDefinition: any = {
                              Title: email,
                              FirstName: this.state.UserDetails[0].Name.split(" ")[0].replace(",", ""),
                              LastName: this.state.UserDetails[0].Name.split(" ")[1],
                              Region: this.state.memberData.region,
                              Country: this.state.memberData.country,
                              Role: "Champion",
                              Status:
                                this.state.memberrole === "manager" ||
                                  this.state.memberrole === "Manager" ||
                                  this.state.memberrole === "MANAGER" ||
                                  localStorage["UserRole"] === "Manager"
                                  ? "Approved"
                                  : "Pending",
                              Group: this.state.memberData.group,
                              FocusArea:
                                this.state.memberData.focusArea || "Teamwork",
                            };
                            const spHttpClientOptions: ISPHttpClientOptions = {
                              body: JSON.stringify(listDefinition),
                            };
                            let flag = await this._getListData(email);
                            if (flag == 0) {
                              const url: string =
                                "/" + this.state.inclusionpath + "/" + this.state.sitename + "/_api/web/lists/GetByTitle('Member List')/items";
                              this.props.context.spHttpClient
                                .post(
                                  url,
                                  SPHttpClient.configurations.v1,
                                  spHttpClientOptions
                                )
                                .then((response: SPHttpClientResponse) => {
                                  if (response.status === 201) {
                                    this.setState({
                                      UserDetails: [],
                                      isAddChampion: false,
                                      load: false
                                    });
                                    this.props.onClickSave(listDefinition.Status);
                                  } else {
                                    this.setState({
                                      errorMessage: `Response status ${response.status} - ${response.statusText}`,
                                      load: false
                                    });
                                  }
                                });
                            } else {
                              this.setState({
                                updatedMessage: LocaleStrings.UserExistingMessage,
                                load: false
                              });
                            }
                          });
                        } else {
                          this.setState({
                            errorMessage: `Response status ${responseuser.status} - ${responseuser.statusText}`,
                            load: false
                          });
                        }
                      });
                  }
                });
              });
          }
        });
      });
  }

  public filterUsers(type: string, selectedOption: any) {
    if (selectedOption.key !== "All") {
      this.setState({
        memberData: {
          ...this.state.memberData,
          [type]: selectedOption.key,
        },
      });
    }
  }

  public options = (optionArray: any) => {
    let myoptions = [];
    myoptions.push({ key: "All", text: "All" });
    optionArray.forEach((element: any) => {
      myoptions.push({ key: element, text: element });
    });
    return myoptions;
  }

  public render() {
    return (
      <div>
        <div className={`container`}>
          <div className={styles.addMembersPath}>
            <img src={require("../assets/CMPImages/BackIcon.png")}
              className={styles.backImg}
              alt={LocaleStrings.BackButton}
            />
            <span
              className={styles.backLabel}
              onClick={() => { this.props.onClickBack(); }}
              title={LocaleStrings.CMPBreadcrumbLabel}
            >
              {LocaleStrings.CMPBreadcrumbLabel}
            </span>
            <span className={styles.border}></span>
            <span className={styles.addMemberLabel}>{this.props.isAdmin ? LocaleStrings.AddMemberPageTitle : LocaleStrings.NominateMemberPageTitle}</span>
          </div>
          {this.state.updatedMessage !== "" ?
            <Label className={styles.updatedMessage}>
              <img src={require('../assets/TOTImages/tickIcon.png')} alt="tickIcon" className={styles.tickImage} />
              {this.state.updatedMessage}
            </Label> : null}
          {this.state.errorMessage !== "" ?
            <Label className={styles.errorMessage}>{this.state.errorMessage} </Label> : null}
          <Label className={styles.pickerLabel}>{this.props.isAdmin ? LocaleStrings.AddMemberPageTitle : LocaleStrings.NominateMemberPageTitle} <span className={styles.asterisk}>*</span></Label>
          <div ref={this.addMemberPeoplePickerParentRef}>
            <PeoplePicker
              context={this.props.context}
              personSelectionLimit={1}
              required={true}
              onChange={this._getPeoplePickerItems.bind(this)}
              showHiddenInUI={false}
              principalTypes={[PrincipalType.User]}
              defaultSelectedUsers={this.state.selectedusers}
              resolveDelay={1000}
              placeholder={LocaleStrings.PeoplePickerPlaceholder}
              ref={this.addMemberPeoplePickerRef}
            />
          </div>
          <br></br>
          <Row>
            <Col md={3}>
              <Dropdown
                onChange={(event: any, selectedOption: any) => this.filterUsers("region", selectedOption)}
                placeholder={LocaleStrings.RegionPlaceholder}
                options={this.options(this.state.regions)}
                styles={dropdownStyles}
                ariaLabel={LocaleStrings.RegionPlaceholder}
              />
            </Col>
            <Col md={3}>
              <Dropdown
                onChange={(event: any, selectedOption: any) => this.filterUsers("country", selectedOption)}
                placeholder={LocaleStrings.CountryPlaceholder}
                options={this.options(this.state.coutries)}
                styles={dropdownStyles}
                ariaLabel={LocaleStrings.CountryPlaceholder}
              />
            </Col>
            <Col md={3}>
              <Dropdown
                onChange={(event: any, selectedOption: any) => this.filterUsers("group", selectedOption)}
                placeholder={LocaleStrings.GroupPlaceholder}
                options={this.options(this.state.groups)}
                styles={dropdownStyles}
                ariaLabel={LocaleStrings.GroupPlaceholder}
              />
            </Col>
            <Col md={3}>
              <Dropdown
                onChange={(event: any, selectedOption: any) => this.filterUsers("focusArea", selectedOption)}
                placeholder={LocaleStrings.FocusAreaPlaceholder}
                options={this.options(this.state.focusAreas)}
                styles={dropdownStyles}
                ariaLabel={LocaleStrings.FocusAreaPlaceholder}
              />
            </Col>
          </Row>
          <div className={styles.btnArea}>
            <button
              className={`btn ${styles.cancelBtn}`}
              onClick={() => this.props.onClickBack()}
              title={LocaleStrings.BackButton}
            >
              <Icon iconName="NavigateBack" className={`${classes.cancelIcon}`} />
              <span className={styles.cancelBtnLabel}>{LocaleStrings.BackButton}</span>
            </button>
            <button
              className={`btn ${styles.saveBtn}`}
              onClick={() => {
                this._createorupdateItem();
                this.state.UserDetails.length > 0 ? this.setState({ load: true }) : this.setState({ load: false });
              }}
              title={LocaleStrings.SaveButton}
            >
              <Icon iconName="Save" className={`${classes.saveIcon}`} />
              <span className={styles.saveBtnLabel}>{LocaleStrings.SaveButton}</span>
            </button>
          </div>
          {this.state.load && <div className={styles.load}></div>}
        </div>
      </div>
    );
  }
}

export default ClbAddMember;
