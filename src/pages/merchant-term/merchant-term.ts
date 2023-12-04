import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-merchant-term',
  templateUrl: 'merchant-term.html',
})
export class MerchantTermPage {

  termsList: any;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    this.setUpMerchantTermsList();
  }

  back() {
    this.navCtrl.pop();
  }

  setUpMerchantTermsList() {
    this.termsList = [
      {
        subtitle: `Welcome to use Vouplan service!`,
        content: [
          `This "Vouplan Merchant Service Agreement" (hereinafter referred to as
            "the service agreement") is the agreement between you and Vouplan on matters
            related to the registration of Vouplan user account and the use of Vouplan
            services. For the use of Vouplan services, you should carefully read and
            comply with all of the content of this service agreement, especially those
            provisions involving exemption or limitation of liability, which may be
            highlighted in bold or underlined form. Unless you have read and accepted
            all terms of this service agreement, you will not be able to register
            Vouplan account or use Vouplan service. If you do not agree with any content
            of these terms of service, please do not register or use Vouplan service,
            and should immediately stop the registration process. If you have any doubt
            about the content of this service agreement (especially the clauses involving
              exemption or limitation of liability), you can contact us at any time
              according to the contact information listed in this service agreement,
              and we will further explain the relevant content for you according to your
              requirements. If you use or accept any service of Vouplan through the
              registration process or in any other way, you shall be deemed to have read
              and agreed to this service agreement and voluntarily accept all contents of
              this service agreement. Please confirm once again that you are aware of and
              fully understand all contents of this service agreement before you decide to
              register or use the service.`,
          `If you are under the age of 18, please be sure to read this service agreement
          accompanied by your parents and other legal guardians, and you should get the
          consent of your parents and other legal guardians before any behavior such as
          registration, order placing, payment or any other service using Vouplan.`,
          `The "services" referred to in this service agreement include the services
              provided by the Vouplan user account to the merchants and individuals related
              to the Vouplan platform, and the services provided by the Vouplan user account
              to other merchants, individuals or other entities under certain business
              categories. This user service agreement for Vouplan platform shall apply
              regardless of the above circumstances.`
        ],
      },
      {
        subtitle: `Definitions`,
        content: [
          `"MERCHANT OFFERING" means the goods and/or services to be provided by the Merchant,
          stated on the Voucher as presented by Vouplan. Values determined by Merchant.`,
          `"FULL OFFER VALUE" means the Amount Paid plus the Promotional Value.`,
          `"AMOUNT PAID" means the amount a purchaser pays for each Voucher.`,
          `"PROMOTIONAL VALUE" means the Full Offer Value less the Amount Paid.`,
          `"PROMOTIONAL VALUE EXPIRATION DATE" means the date stated on the Voucher
          when the Promotional Value expires.`,
          `"REMITTANCE AMOUNT" means the amount Vouplan shall remit to Merchant for each
          Voucher, subject to the payment terms.`,
          `"VOUCHER RULES" means the conditions and restrictions concerning Voucher redemption
          and the Merchant Offering stated on the Website and Voucher.`,
        ],
      },
      {
        subtitle: `1. Voucher Program`,
        content: [
          `(1) Vouplan is authorized to promote and sell Vouchers on Merchant’s behalf subject
          to the terms of this Agreement. The Voucher will evidence the Merchant Offering and
          will be sent to the purchaser electronically
          once payment is received. The purchaser will then redeem the Voucher with the Merchant
          by presenting the Voucher in paper or electronic form. Merchant is the issuer of the
          Vouchers and seller of the Merchant Offering. If there is a conflict between this
          Agreement and the Terms of Sale, the Agreement controls.`,
          `(2) Vouplan is authorized to promote and sell Vouchers on Merchant’s behalf through
          any platform, including its feature deal-of-the-day, affiliates, business partner
          network, marketplace, or referral network. The Vouchers may be offered to all or part
          of Vouplan’s subscriber base or its affiliate subscriber base or referral network
          and segmented by various variables including gender, age, location, and consumer
          preferences. The features may be offered through a variety of distribution channels,
          including, the Internet, the Website, affiliate websites, business partner network,
          email, mobile applications, other types of electronic offerings and other platforms
           or distribution channels owned, controlled, or operated by Vouplan, its affiliates
           or business partners. In addition, in connection with Vouplan’s promotion of a Merchant
           Offering, Merchant authorizes Vouplan to shorten or extend the Promotional Value Expiration Date..`,
          `(3) Vouplan reserves the continuing right to reject, revise, or discontinue any Merchant
          Offering, at any time and for any reason in Vouplan’s sole discretion, and to terminate the
          Merchant Offering and to remove all references to the Merchant Offering and Voucher from
          the Website; and redirect or delete any URL used in connection with the Merchant Offering.`,
          `(4) MMerchant shall honor the Vouchers for the Merchant Offering through the Promotional
          Value Expiration Date. After the Promotional Value Expiration Date,erchant agrees to redeem
          the voucher for the amount paid indefinitely.`,
          `(5) After the Promotional Value Expiration Date, Merchant must always allow the purchaser
          to redeem the Voucher for the Amount Paid toward the Merchant Offering. If the goods and
          services constituting the Merchant Offering and stated on the Voucher are no longer available,
          the Merchant must always allow the purchaser to redeem the Voucher toward any goods or
          services then offered by the Merchant equivalent to at least the Amount Paid.`,
          `(6) Partial redemptions: If applicable, and if a purchaser redeems a Voucher for less than
          the Amount Paid, the Merchant is responsible for handling any unredeemed value as required
          by applicable law.`,
          `(7) Merchant agrees that in providing the Merchant Offering, Merchant will not inflate prices
          or impose any additional fees, charges, conditions or restrictions that contradict or are
          inconsistent with the terms stated on the Voucher, including the Voucher Rules. Unless disclosed
          in the Voucher Rules, Merchant further agrees not to impose different terms or a different
          cancellation policy than what is imposed on its non-Vouplan customers.`,
          `(8) For any seasonal Merchant Offering(s), following the initial Promotional Value Expiration Date
          specified in the Vouplan Merchant Agreement the: Promotional Value Expiration Date will reset
          to be the end of the immediately following season specified by Merchant;
          Throughout the Term (as defined herein), the Promotional Value Expiration Date for the seasonal
          Merchant Offering(s) will continue to reset after each season.`,
          `(9) Merchant is responsible for all customer service in connection with the Merchant Offering
          and for supplying all goods and services stated in the Merchant Offering. Merchant is also
          responsible for any customer loyalty programs associated with the Merchant Offering.`,
          `(10) Merchant agrees to accept returns of the Merchant Offering in compliance with applicable
          laws and the Voucher Rules, but in any event: (i) will accept returns of a defective Merchant Offering
          or nonconforming items in or a part of any Merchant Offering at all times and pay (or reimburse a
            purchaser for) any and all costs associated with the return of such Merchant Offering; and (ii)
            will not impose a more restrictive return policy on purchasers than Merchant’s regular return
            policy as applied to Merchant’s purchaser in the ordinary course of Merchant’s business.`,
          `(11) If merchant choose to use the items in the menu of merchant's store as promotional items,
          the PROMOTIONAL VALUE should not be higher than the value of that specific items in the menu.`
        ],
      },
      {
        subtitle: `2. Payment`,
        content: [
          `(1) Taxes Generally. It is Merchant’s responsibility to determine what, if any, taxes apply
          to the payments Merchant makes or receives, and it is Merchant’s responsibility to collect,
          report and remit the correct tax to the appropriate tax authority. Vouplan is not responsible
          for determining whether taxes apply to Merchant’s transaction with either purchasers or Vouplan,
          or for collecting, reporting or remitting any taxes arising from any transaction with or by
          Merchant and purchaser. Merchant may be asked to provide Vouplan with a valid Tax Identification
          Number for tax reporting purposes. Notwithstanding anything else in this Agreement, Merchant
          shall be, and will remain, registered for sales, use and other similar tax collection purposes
          in all states and localities in which Merchant is required to be so registered in connection
          with the Merchant Offering and pursuant to the terms and redemption of the Voucher, and
          shall be responsible for paying any and all sales, use or any other taxes related to the
          Merchant Offering or the goods and services.`,
          `(2) Transaction Taxes. Merchant bears sole financial responsibility for any and all sales,
          use, excise, general, SST, or other similar taxes, including any interest penalties and additions
          related thereto, imposed on or arising from the transactions contemplated by this Agreement between
          Vouplan and Merchant ("Transaction Taxes"), if any. Vouplan shall apply the applicable Transaction
          Tax to the amounts it retains and/or other fees remitted to Vouplan pursuant this Agreement.
          Transaction Taxes are calculated using the Merchant’s billing address and will be included on invoices.
          Tax rates are subject to change. If applied, Transaction Taxes will be calculated at the time of each
          payment using the rates in effect under current law.`,
          `(3) Notwithstanding anything to the contrary, Vouplan will have no obligation to advance amounts
          that have been paid to Vouplan by a purchaser until Merchant has complied with Merchant’s obligations
          under this Agreement. If Vouplan reasonably believes that Merchant has breached any provision
          of this Agreement, Vouplan may offset, delay, withhold, or suspend future payments to Merchant,
          in Vouplan’s sole discretion. In addition, if Merchant is unwilling to, or in Vouplan’s reasonable
          discretion appears unable to, perform its obligations under this Agreement, Vouplan is authorized to
          offset, delay, withhold, or suspend future payments to Merchant in addition to such other remedies
          as may be available under this Agreement or at law, to secure payment from Merchant for any refunds
          and/or other amounts payable by Merchant under this Agreement.`,
        ],
      },
      {
        subtitle: `3. Customer Data Restrictions`,
        content: [
          `(1) "Customer Data" means all identifiable information about purchasers generated or collected
          by Vouplan or Merchant, including, but not limited to, purchasers’ name, email addresses,
          phone numbers, purchaser preferences and tendencies, and financial transaction data.`,
          `You have learned that during the registration process of Vouplan account, some initial
          registration data may not be able to be changed again due to security, internal management
          and other reasons. Therefore, you should carefully check this part of the registration
          information, to ensure that the correct completion.`,
          `(2) Merchant shall use Customer Data only to fulfill its redemption obligations in connection
          with the Merchant Offering as authorized by this Agreement. Merchant expressly agrees that
          any Customer Data shall be used only for this purpose (including, but not limited to, the
            redemption of Vouchers and provision of goods and services to purchasers), and not to enhance
            a file or list owned by Merchant, or any third party. Merchant represents, warrants and
            covenants that it will not resell, broker or otherwise disclose any Customer Data to any
            third party, in whole or in part, for any purpose, unless required by applicable law.
            If Merchant engages any third party to facilitate its redemption obligations hereunder,
            Merchant shall ensure that such third party implements and complies with reasonable
            security measures in handling any Customer Data. If any Customer Data is collected directly
            by Merchant or a third party engaged by Merchant to facilitate its redemption obligations
            hereunder, Merchant shall ensure that it or such third party adopts, posts and processes
            the Customer Data in conformity with its posted privacy policy and all applicable laws.`,
          `(3) As long as Merchant uses Customer Data in compliance with applicable law and Merchant’s posted
          privacy policy, restrictions stated in this Agreement on Merchant’s use of Customer Data do
          not apply to: (i) data from any purchaser who is already a customer of Merchant before the
          Effective Date, if such data was provided to Merchant by such purchaser independent of this
          Agreement or any transaction hereunder; or (ii) data supplied by a purchaser directly to
          Merchant who becomes a customer of Merchant in connection with such purchaser explicitly opting
          in to receive communications from Merchant.`,
          `(4) Merchant shall immediately notify Vouplan if Merchant becomes aware of or suspects any
          unauthorized access to or use of Customer Data or any confidential information of Vouplan, and
          shall cooperate with Vouplan in the investigation of such breach and the mitigation of any damages.
          Merchant will bear all associated expenses incurred by Vouplan to comply with applicable laws
          (including, but not limited to, any data breach laws) or arising from any unauthorized access
          or acquisition of Customer Data while such data is in Merchant’s reasonable possession or
          control. Upon termination or expiration of this Agreement, Merchant shall, as directed by
          Vouplan, destroy or return to Vouplan all the Customer Data in Merchant’s or any agent of
          Merchant’s possession.`,
        ],
      },
      {
        subtitle: `4. Term and Termination`,
        content: [
          `(1) This Agreement will continue in effect until terminated by either party in accordance
          with this Section (“Term”). Vouplan is authorized to terminate this Agreement, at any
          time for any reason, upon written notice to Merchant. Merchant is authorized to terminate
          this Agreement upon seven (7) business days prior written notice to Vouplan. Termination
          of this Agreement will not in any way affect Merchant’s obligation to redeem any Voucher
          according to the terms of this Agreement, including the obligation to honor the Voucher
          for the Amount Paid after the Promotional Value Expiration Date. Provisions in this
          Agreement that are intended to survive termination will continue in full force and effect
          after the Term.`,
        ],
      },
      {
        subtitle: `5. Marketing`,
        content: [
          `(1) Vouplan and its business partners may communicate with Merchant with regard to products,
          promotions, and other services that may be of interest to Merchant. This may include email
          or other communications. Vouplan may also solicit Merchant’s opinion for market research
          purposes.`,
        ],
      },
      {
        subtitle: `6. Intellectual Property Rights`,
        content: [
          `(1) Merchant grants to Vouplan a non-exclusive, worldwide, royalty free, paid-up,
          perpetual, irrevocable, transferable and sub-licensable license and right to use,
          modify, reproduce, sublicense, publicly display, distribute, broadcast, transmit,
          stream, publish and publicly perform: (a) Merchant’s name, logos, trademarks,
          service marks, domain names, and any audiovisual content, video recordings,
          audio recordings, photographs, graphics, artwork, text and any other content provided,
          specified, recommended, directed, authorized or approved to use by Merchant
          (collectively, "Merchant IP"); and (b) any third party’s name, logos, trademarks,
          service marks, domain names, audiovisual recordings, video recordings, audio recordings,
          photographs, graphics, artwork, text and any other content provided, specified, recommended,
          directed, authorized or approved for use by Merchant (collectively, "Third Party IP"),
          in each case in connection with the promotion, sale/resale (as may be applicable) or
          distribution of the Merchant Offering in all media or formats now known or hereinafter
          developed ("License"). Any use of the Merchant IP or Third Party IP as contemplated in this
          Agreement is within Vouplan’s sole discretion.`,
          `(2) Merchant acknowledges and agrees that, as between the parties, Vouplan owns all
          interest in and to the Website, Customer Data, Vouplan trade names, logos, trademarks,
          service marks, domain names, social media identifiers, all data collected through or
          from the Website, all audiovisual content, video recordings, audio recordings, photographs,
          graphics, artwork, text or any other content created by Vouplan or at Vouplan’s direction, or
          assigned to Vouplan, and any materials, software, technology or tools used or provided by
          Vouplan to promote, sell/resell (as may be applicable) or distribute the Merchant Offering
          and conduct its business in connection therewith (collectively “Vouplan IP”). Merchant
          shall not use, sell, rent, lease, sublicense, distribute, broadcast, transmit, stream,
          place shift, transfer, copy, reproduce, download, time shift, display, perform, modify
          or timeshare the Vouplan IP or any portion thereof, or use such Vouplan IP as a component
          of or a base for products or services prepared for commercial use, sale, sublicense,
          lease, access or distribution, except that Vouplan grants Merchant a limited, non-exclusive,
          revocable, non-transferable, non-sub licensable license during the Term to use one copy of
          Vouplan’s mobile merchant software application on a single mobile computer, tablet computer,
          or other device, solely for the purposes permitted by that software, and to make one copy
          of the software for back-up purposes. Merchant shall keep the Vouplan IP confidential, and
          shall not prepare any derivative work based on the Vouplan IP or translate, reverse engineer,
          decompile or disassemble the Vouplan IP. Merchant shall not take any action to challenge
          or object to the validity of Vouplan’s rights in the Vouplan IP or Vouplan’s ownership or
          registration thereof. Except as specifically provided in this Agreement, Merchant and any
          third party assisting Merchant with its obligations in this Agreement, are not authorized
          to use Vouplan IP in any medium without prior written approval from an authorized representative
          of Vouplan. Merchant shall not include any trade name, trademark, service mark, domain name,
          social media identifier, of Vouplan or its affiliates, or any variant or misspelling thereof,
          in any trademark, domain name, email address, social network identifier, metadata or search
          engine keyword. Merchant shall not use or display any Vouplan IP in a manner that could reasonably
          imply an endorsement, relationship, affiliation with, or sponsorship between Merchant or a
          third party and Vouplan. All rights to the Vouplan IP not expressly granted in this Agreement
          are reserved by Vouplan.`,
          `(2) If Merchant provides Vouplan or any of its affiliates with feedback, suggestions, reviews,
          modifications, data, images, text, or other information or content about a Vouplan product or
          service or otherwise in connection with this Agreement, any Vouplan IP, or Merchant’s
          participation in the Merchant Offering or Voucher, (collectively, “Feedback”), Merchant
          irrevocably assigns to Vouplan all right, title, and interest in and to Feedback. In the
          event your assignment to Vouplan is invalid for any reason, you hereby irrevocably grant
          Vouplan and its affiliates a perpetual, paid-up, royalty-free, nonexclusive, worldwide, irrevocable,
          freely transferable right and license to (i) use, reproduce, perform, display, and distribute
          Feedback; (ii) adapt, modify, re-format, and create derivative works of Feedback for any purpose
          and sublicense the foregoing rights to any other person or entity. Merchant warrants that:
          (A) Feedback is Merchant’s original work, or Merchant obtained Feedback in a lawful manner;
          and (B) Vouplan and its sublicensees’ exercise of rights under the license above will not
          violate any person’s or entity’s rights, including any copyright rights. Merchant agrees to
          provide Vouplan such assistance as Vouplan might require to document, perfect, or maintain
          Vouplan’s rights in and to Feedback`
        ],
      },
      {
        subtitle: `7. Indemnification`,
        content: [
          `To the extent allowed under applicable law, Merchant agrees to defend, indemnify and hold
          Vouplan, its affiliated and related entities, and any of its respective officers, directors,
          agents and employees, harmless from and against any claims, lawsuits, investigations,
          penalties, damages, losses or expenses (including but not limited to reasonable attorneys’
            fees and costs) arising out of or relating to any of the following: (a) any breach or
            alleged breach by Merchant of this Agreement, or the representations and warranties made
            in this Agreement; (b) any claim for state sales, use, or similar tax obligations of
            Merchant arising from the sale and redemption of a Voucher; (c) any claim by any local,
            state, provincial, territorial or federal governmental entity for unredeemed Vouchers
            or unredeemed cash values of Vouchers or any other amounts under any applicable
            abandoned or unclaimed property or escheat law, including but not limited to any claims
            for penalties and interest; (d) any claim arising out of a violation of any law or regulation
            by Merchant or governing Merchant’s goods and/or services; (e) any claim arising out of
            Merchant’s violation of law or regulation governing the use, sale, and distribution of
            alcohol; (f) any claim by a purchaser or anyone else arising out of or relating to the
            goods and services provided by Merchant and/or pick up of the goods and services at the
            Redemption Site, including but not limited to, any claims for false advertising, product
            defects, personal injury, death, or property damages; (g) any claim by a purchaser for the
            Amount Paid; (h) any claim arising out of Merchant’s misuse of Customer Data, or any
            violation of an applicable data privacy or security law; and (i) any claim arising out of
            Merchant’s negligence, fraud or willful misconduct. Vouplan maintains the right to control
            its own defense and to choose and appoint its own defense counsel, regardless of the presence
            or absence of a conflict of interest between Vouplan and Merchant. Merchant’s duty to defend
            and indemnify Vouplan includes the duty to pay Vouplan’s reasonable attorneys’ fees and costs,
            including any expert fees.`
        ],
      },
      {
        subtitle: `8. Confidentiality`,
        content: [
          `The terms for the Merchant Offering described in this Agreement are confidential,
          and Merchant agrees not to disclose the terms described in this Agreement to any party
          (other than to its employees, parent companies, shareholders, lawyers and accountants on a
            strict need-to-know basis or as required by applicable public records and other law, if
            Merchant has taken the necessary precautions of the kind generally taken with confidential
            information to preserve the confidentiality of the information made available to such
            parties). In the event of a breach, Vouplan is entitled to injunctive relief and a
            decree for specific performance, and any other relief allowed under applicable law
            (including monetary damages if appropriate).`,
        ],
      },
      {
        subtitle: `9. Limitation of Liability`,
        content: [
          `(1) Except for merchant’s indemnification obligations hereunder, in no event is
          either party liable or obligated to the other party or any third party for any lost
          profits, lost business, special, incidental, exemplary, consequential, punitive, or
          indirect damages regardless of the form of action, whether in contract, tort or otherwise,
          even if informed of the possibility of any such damages in advance. Vouplan’s sole and
          complete liability to merchant for any claims arising out of or relating to this
          agreement, or any errors, omissions or misplacements of any voucher is limited to the
          amount of fees retained by Vouplan hereunder for the preceding six(6) months after final
          calculation and reconciliation of all refunds. This limitation of liability applies
          to the maximum extent permitted by applicable law and notwithstanding the failure of
          any limited remedy. In addition, any claim by or on behalf of a merchant in connection
          with any payment made by Vouplan, including, but not limited to, claims alleging that
          a merchant was underpaid, must be made in writing to Vouplan within ninety (90) days
          from the date Vouplan remits the payment at issue. All claims not made in accordance
          with the foregoing shall be deemed waived, released and discharged by merchant.`
        ],
      },
      {
        subtitle: `10. Other`,
        content: [
          `(1) The parties are independent contractors. Nothing in this Agreement is to be
          construed to create a joint venture, partnership, franchise, or an agency relationship
          between the parties. Neither party has the authority, without the other party’s prior
          written approval, to bind or commit the other in any way.`,
          `(2) This Agreement constitutes the entire agreement between the parties relating to
          its subject matter and supersedes all prior or contemporaneous oral or written
          agreements concerning such subject matter.`,
          `(3) Merchant is not authorized to transfer or assign its rights or obligations
          under this Agreement, whether by operation of law or otherwise, without Vouplan’s
          prior written consent. Any waiver must be in writing and signed by an authorized
          signatory of Vouplan. Vouplan is authorized to transfer or assign this Agreement to
          a present or future affiliate or pursuant to a merger, consolidation, reorganization
          or sale of all or substantially all of the assets or business, or by operation of
          law, without notice to Merchant.`,
          `(4) If any provision of this Agreement should be held to be invalid or unenforceable,
          the validity and enforceability of the remaining provisions of this Agreement are not
          affected.`,
          `(5) Except as expressly stated in this agreement, neither party makes any representations
          or warranties, express nor implied, including but not limited to any implied warranty
          of merchantability, fitness for a particular purpose or non-infringement. Vouplan does
          not warrant or guarantee that the services offered on or through the website will be
          uninterrupted or error-free, that the vouchers are error-free, or that any merchant
          offering will result in any revenue or profit for merchant.`
        ],
      },
      {
        subtitle: `Thanks again for your patience!`,
        content: [
          ``
        ],
      },
    ];
  }
}
