export default function TicketPolicyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-3">
            Gorakhpur's Got Latent
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Ticket Policy & Entry Guide
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Last updated: 3 October 2026
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1019] p-5 sm:p-8 lg:p-10 shadow-2xl">
          <div className="space-y-9 text-sm sm:text-[15px] leading-7">
            <section>
              <p>
                This Ticket Policy explains how to purchase a Gorakhpur's Got Latent
                ticket, what happens after successful payment, how your ticket is
                verified at the venue, and the conditions that apply to entry,
                cancellation, refund, transfer, and ticket use.
              </p>
              <p className="mt-4">
                Please read this page completely before purchasing. A ticket is a
                digital entry credential for the relevant GGL event and must be kept
                safely until your entry has been completed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">1. Who Should Buy a Ticket?</h2>
              <p className="mt-3">
                Anyone who meets the eligibility and entry requirements published for
                the particular GGL event may purchase a ticket, subject to ticket
                availability. If an event has a minimum-age requirement, the purchaser
                and attendee must satisfy that requirement.
              </p>
              <p className="mt-4">
                Please check the event information before payment. Purchasing a ticket
                does not override age restrictions, security checks, venue rules, or
                any other mandatory entry condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">2. How to Buy Your Ticket</h2>
              <ol className="mt-4 list-decimal pl-6 space-y-3">
                <li>Open the official GGL website and go to the <span className="text-white font-semibold">Book Ticket</span> / ticket booking page.</li>
                <li>Select the available ticket option or quantity shown on the booking page.</li>
                <li>Enter your correct name, mobile/WhatsApp number, email address, and any other information requested by the booking form.</li>
                <li>Review the ticket quantity, event information, price, and applicable terms before continuing.</li>
                <li>Proceed to the secure payment gateway and complete payment using an available payment method.</li>
                <li>Wait for the payment and booking process to finish. Do not refresh repeatedly or make another payment while the first transaction is still showing as pending.</li>
                <li>After successful confirmation, keep the ticket, booking ID, QR code, or verification code safely until you have entered the event.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">3. What Happens After Payment?</h2>
              <p className="mt-3">
                A successful payment and confirmed booking may generate a digital ticket
                containing a unique ticket number, booking ID, QR code, verification
                code, or other identifying information.
              </p>
              <p className="mt-4">
                Save the ticket on your phone and, where possible, keep a backup of the
                booking information. You may also receive confirmation through the
                contact details supplied during booking.
              </p>
              <p className="mt-4">
                A payment receipt alone should not be treated as proof of entry if the
                ticket/order has not been successfully confirmed. If money has been
                deducted but your ticket has not arrived, contact support before making
                another payment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">4. Keep Your Ticket Safe</h2>
              <p className="mt-3">
                Your ticket or its unique verification information should be treated
                like an entry credential. Do not publicly post a full QR code, ticket
                code, booking ID, or other verification information on social media.
              </p>
              <p className="mt-4">
                GGL is not responsible for unauthorized use of a ticket where the
                customer has voluntarily shared its verification information and
                another person uses it before the genuine holder arrives.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">5. How Entry Verification Works</h2>
              <p className="mt-3">
                At the event, the authorized entry team will verify your ticket using
                the available QR scanner, ticket verification system, booking ID, or
                another official verification method.
              </p>
              <p className="mt-4">
                Depending on the event's entry setup, you may be asked to present the
                ticket on your phone and allow the team to scan it, or provide the
                required ticket/booking code for verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">6. Ticket Becomes Used After Successful Entry</h2>
              <p className="mt-3">
                Once an authorized GGL entry operator successfully verifies and accepts
                a ticket for entry, that ticket is marked as <span className="text-white font-semibold">USED / ENTERED</span>
                in the ticket verification system.
              </p>
              <p className="mt-4">
                A used ticket cannot normally be used again for another entry. If the
                same ticket ID, QR code, or verification code is presented again after
                successful entry, the system may show that the ticket has already been
                used and entry may be refused.
              </p>
              <p className="mt-4">
                This single-use verification is intended to prevent duplicate entry,
                ticket sharing after entry, and unauthorized reuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">7. If Your Ticket Shows “Already Used”</h2>
              <p className="mt-3">
                If the verification system shows that your ticket has already been
                used even though you have not entered the event, immediately approach
                the authorized GGL entry/support desk. Keep your original booking
                information and payment details available so the team can investigate.
              </p>
              <p className="mt-4">
                Do not purchase another ticket solely because of a verification error
                until the entry team has reviewed the original ticket where practical.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">8. Entry Requirements</h2>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li>Carry your valid digital ticket or the official verification information.</li>
                <li>Keep your phone charged and ensure the ticket can be displayed when requested.</li>
                <li>Carry valid identification if the event or venue requires identity or age verification.</li>
                <li>Follow venue security checks and instructions from authorized event staff.</li>
                <li>Follow the published age requirement and other event-specific entry conditions.</li>
                <li>Do not attempt to enter using a copied, altered, fraudulent, cancelled, or already-used ticket.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">9. Ticket Is Non-Refundable</h2>
              <p className="mt-3">
                All confirmed GGL tickets are <span className="text-white font-semibold">NON-REFUNDABLE</span>
                and cannot normally be cancelled after successful purchase.
              </p>
              <p className="mt-4">
                This includes situations such as a change of mind, inability to attend,
                personal plans changing, late arrival, buying the wrong quantity,
                forgetting the event, or deciding not to attend.
              </p>
              <p className="mt-4">
                The only general exception is where GGL <span className="text-white font-semibold">officially
                cancels the event and officially announces that ticket holders are
                eligible for a refund</span>, or where a refund is otherwise required
                by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">10. Event Cancellation</h2>
              <p className="mt-3">
                If GGL officially cancels an event and announces a refund process,
                eligible ticket holders will be informed about the applicable procedure,
                deadline, and refund method.
              </p>
              <p className="mt-4">
                Approved refunds will generally be processed through the original
                payment method, subject to payment-provider processing timelines.
              </p>
              <p className="mt-4">
                An event is considered officially cancelled only when GGL communicates
                the cancellation through an official channel. Social-media rumours,
                unofficial messages, screenshots, or third-party statements do not by
                themselves constitute an official cancellation notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">11. Postponement or Date Change</h2>
              <p className="mt-3">
                If an event is postponed or its date is changed instead of being
                cancelled, GGL may announce that existing tickets remain valid for the
                revised date. Any refund option for a postponed event will be stated in
                the official announcement for that event.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">12. Wrong or Duplicate Ticket Purchase</h2>
              <p className="mt-3">
                Please carefully check the ticket quantity and event information before
                payment. A customer who accidentally buys extra tickets or selects the
                wrong option is generally not entitled to a refund solely because of
                that mistake.
              </p>
              <p className="mt-4">
                If the same transaction is accidentally charged more than once because
                of a payment or network issue, contact support. A confirmed duplicate
                eligible payment may be reconciled separately under the Refund &
                Cancellation Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">13. Payment Failed, Pending or Amount Debited</h2>
              <p className="mt-3">
                If payment is pending, failed, or appears incomplete, do not repeatedly
                retry the payment without checking the transaction status.
              </p>
              <p className="mt-4">
                If your bank account or payment method was debited but no ticket was
                generated, contact GGL support with the transaction reference, amount,
                date, and booking details. The payment status may need to be reconciled
                with the payment provider before a ticket or refund can be confirmed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">14. Ticket Transfer and Sharing</h2>
              <p className="mt-3">
                A ticket should only be used according to the transfer and identity
                rules communicated for the relevant event. Sharing a QR code or ticket
                screenshot with multiple people can result in the first successful
                verification consuming the ticket and subsequent users being denied
                entry.
              </p>
              <p className="mt-4">
                If a ticket is transferable for a particular event, follow the official
                transfer process rather than editing the ticket manually.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">15. Fraudulent or Altered Tickets</h2>
              <p className="mt-3">
                Tickets that appear altered, duplicated, forged, manipulated, obtained
                through unauthorized access, or connected with suspicious payment
                activity may be rejected. GGL may investigate the transaction and may
                refuse entry where authenticity cannot be established.
              </p>
              <p className="mt-4">
                Never buy a GGL ticket from an unknown third party when an official
                ticketing channel is available.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">16. Event Rules and Right of Entry</h2>
              <p className="mt-3">
                A valid ticket does not give a customer permission to violate venue
                rules, security procedures, age restrictions, prohibited-item rules,
                or reasonable instructions issued by authorized event staff.
              </p>
              <p className="mt-4">
                Entry may be refused where the ticket is invalid, already used,
                fraudulent, cancelled, or where the attendee does not satisfy a
                mandatory event or venue requirement. Refund eligibility in such cases
                is governed by the applicable Ticket & Refund Policy and event terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400">17. Ticket Support</h2>
              <p className="mt-3">
                For booking, payment, ticket delivery, or verification problems, contact
                the official support team and include your ticket/order ID or payment
                reference whenever available.
              </p>
              <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
                <p className="text-white font-semibold">Gorakhpur's Got Latent</p>
                <p className="mt-2">
                  Email:{' '}
                  <a href="mailto:help@gkpgotlatent.in" className="text-amber-400 hover:underline">
                    help@gkpgotlatent.in
                  </a>
                </p>
                <p>
                  WhatsApp / Support: <span className="text-white">+91 84238 58424</span>
                </p>
                <p>
                  Website:{' '}
                  <a href="https://www.gkpgotlatent.in" className="text-amber-400 hover:underline">
                    www.gkpgotlatent.in
                  </a>
                </p>
              </div>
            </section>

            <section className="border-t border-white/10 pt-7">
              <p className="text-xs sm:text-sm text-slate-400">
                By purchasing and using a GGL ticket, you confirm that you have reviewed
                the ticket, entry, verification, and refund conditions applicable to
                the event.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
